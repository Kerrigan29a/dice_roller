//go:build js && wasm

package main

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"html/template"
	"math/rand/v2"
	"sort"
	"strconv"
	"strings"
	"syscall/js"
	"time"

	"github.com/Kerrigan29a/dice_roller/go/internal/roller"
)

//go:embed shell.html
var shell string

//go:embed controls.html
var controls string

//go:embed result.html
var resultTemplate string

var document = js.Global().Get("document")
var browser = js.Global().Get("diceBrowser")
var callbacks []js.Func

func element(id string) js.Value             { return document.Call("getElementById", id) }
func text(id, value string)                  { element(id).Set("textContent", value) }
func attr(node js.Value, name, value string) { node.Call("setAttribute", name, value) }
func nodes(selector string, visit func(js.Value)) {
	list := document.Call("querySelectorAll", selector)
	for i := 0; i < list.Length(); i++ {
		visit(list.Index(i))
	}
}
func keep(fn func(js.Value, []js.Value) any) js.Func {
	callback := js.FuncOf(fn)
	callbacks = append(callbacks, callback)
	return callback
}
func listen(name string, handler func(js.Value)) {
	callback := keep(func(_ js.Value, args []js.Value) any { handler(args[0]); return nil })
	document.Call("addEventListener", name, callback.Value)
}

type numeric struct{ ID, Label, Value, Unit string }

var functions = template.FuncMap{
	"field":      func(id, label, value, unit string) numeric { return numeric{id, label, value, unit} },
	"presets":    func() []string { return []string{"4", "6", "8", "10", "12", "20", "100"} },
	"preset":     func(value string, p roller.Preferences) bool { return !p.Custom && p.Sides == value },
	"modes":      func() []roller.Mode { return []roller.Mode{roller.All, roller.Max, roller.Min, roller.Sum} },
	"tableLabel": roller.TableLabel,
}
var shellView = template.Must(template.New("shell").Parse(shell))
var controlsView = template.Must(template.New("controls").Funcs(functions).Parse(controls))
var resultView = template.Must(template.New("result").Parse(resultTemplate))

func render(view *template.Template, data any) string {
	var output bytes.Buffer
	if err := view.Execute(&output, data); err != nil {
		panic(err)
	}
	return output.String()
}

type app struct {
	Prefs                        roller.Preferences
	sequence                     *roller.Sequence
	theme, problem, catalogState string
	newer, iconCount             int
	catalog                      []string
	showHistory, validate        bool
	report, gotCatalog, copied   js.Func
}

func main() {
	a := &app{Prefs: roller.ReadPreferences(browser.Call("storedPreferences").String()), theme: "auto", catalogState: "loading", iconCount: browser.Call("iconCount").Int()}
	fromLink := browser.Call("hasState").Bool()
	var saved roller.Archive
	var err error
	if fromLink {
		saved, err = roller.DecodeLink(browser.Call("stateToken").String())
	} else {
		saved, err = roller.Decode(browser.Call("storedSession").String())
	}
	var newer roller.NewerVersion
	switch {
	case err == nil:
		a.sequence = roller.Replay(saved, a.iconCount)
		if saved.Theme == "light" || saved.Theme == "dark" {
			a.theme = saved.Theme
		}
	case errors.As(err, &newer):
		a.problem, a.newer = "newer", int(newer)
	case fromLink:
		a.problem = "invalid"
	}
	if a.sequence == nil {
		a.sequence = freshSequence()
	}
	element("app").Set("innerHTML", render(shellView, roller.Version))
	a.report = keep(func(_ js.Value, args []js.Value) any {
		text("save-issue", args[0].String())
		element("save-notice").Set("hidden", false)
		return nil
	})
	a.gotCatalog = keep(func(_ js.Value, args []js.Value) any {
		a.catalogState = "failed"
		var data struct {
			Icons map[string]map[string][]string
		}
		if json.Unmarshal([]byte(args[0].String()), &data) == nil {
			var paths []string
			for size, authors := range data.Icons {
				for author, names := range authors {
					for _, name := range names {
						paths = append(paths, "../assets/icons/ffffff/transparent/"+size+"/"+author+"/"+name+".svg")
					}
				}
			}
			if len(paths) == a.iconCount && len(paths) > 0 {
				sort.Strings(paths)
				a.catalog = paths
				a.catalogState = "ready"
			}
		}
		a.syncControls()
		a.paintResults()
		return nil
	})
	a.copied = keep(func(_ js.Value, args []js.Value) any {
		message := "Link copied."
		if !args[0].Bool() {
			message = "Copy failed. The link is selected so you can copy it manually."
		}
		text("share-status", message)
		return nil
	})
	listen("click", a.click)
	listen("input", a.input)
	listen("submit", func(event js.Value) {
		if event.Get("target").Get("classList").Call("contains", "tool-form").Bool() {
			event.Call("preventDefault")
			a.runTool()
		}
	})
	listen("keydown", a.keydown)
	a.paintControls()
	a.paintTheme()
	a.paintProblem()
	a.paintResults()
	browser.Call("setTitle", "Dice Roller (v"+roller.Version+")")
	browser.Call("loadCatalog", a.gotCatalog.Value)
	if a.problem == "" {
		a.save()
	}
	select {}
}

func freshSequence() *roller.Sequence {
	return roller.New(rand.IntN(roller.MaxQuantity-1) + 1)
}

func (a *app) save() {
	encoded := a.sequence.Archive(a.theme).Encode()
	browser.Call("saveSession", encoded, roller.LinkToken(encoded), a.report.Value)
}
func (a *app) preferences() {
	value, err := json.Marshal(a.Prefs)
	if err != nil {
		panic(err)
	}
	browser.Call("savePreferences", string(value), a.report.Value)
}
func (a *app) paintTheme() {
	attr(element("app-shell"), "data-theme", a.theme)
	element("theme-desktop").Set("value", a.theme)
	element("theme-mobile").Set("value", a.theme)
}
func (a *app) paintProblem() {
	broken := a.problem != ""
	element("problem").Set("hidden", !broken)
	element("tool-tabs").Set("hidden", broken)
	element("controls").Set("hidden", broken)
	nodes("[data-action=share]", func(node js.Value) { node.Set("disabled", broken) })
	nodes("[data-action=clear]", func(node js.Value) { node.Set("hidden", broken) })
	if !broken {
		return
	}
	heading, description := "Shared link unavailable", "This link could not be opened."
	extra := ""
	if a.problem == "newer" {
		heading, description = "Newer version detected", fmt.Sprintf("These results use format %d. Try updating Dice Roller to open it.", a.newer)
		extra = "<button type=\"button\" class=\"secondary\" data-action=\"update\">Update and reload</button>"
	}
	body := "<div><h2>" + heading + "</h2><p class=\"muted\">" + description + "</p></div><div class=\"button-row\">" + extra + "<button type=\"button\" class=\"secondary\" data-action=\"saved\">Open saved results</button>"
	if a.problem == "newer" {
		body += "<button type=\"button\" class=\"secondary\" data-action=\"clear\">Start new…</button>"
	}
	element("problem").Set("innerHTML", body+"</div>")
}
func (a *app) paintControls() {
	for _, tool := range []string{"dice", "words", "icons"} {
		active := a.Prefs.Tool == tool
		tab := element("tool-tab-" + tool)
		attr(tab, "aria-selected", strconv.FormatBool(active))
		tab.Set("tabIndex", -1)
		if active {
			tab.Set("tabIndex", 0)
		}
		panel := element("tool-panel-" + tool)
		panel.Set("hidden", !active)
		if active {
			panel.Set("innerHTML", render(controlsView, a))
		} else {
			panel.Set("innerHTML", "")
		}
	}
	a.syncControls()
}
func (a *app) syncControls() {
	if !element("run-tool").Truthy() {
		return
	}
	action, invalid := a.Prefs.Action()
	label := "Show icons"
	switch a.Prefs.Tool {
	case "dice":
		label = "Roll"
		if invalid == "" {
			label += " " + action.Label()
		} else if a.Prefs.Mode != roller.All {
			label += " " + a.Prefs.Mode.Label()
		}
	case "words":
		label = "Ask"
	}
	text("run-tool", label)
	element("run-tool").Set("disabled", a.problem != "" || a.Prefs.Tool == "icons" && a.catalogState != "ready")
	for _, id := range []string{"dice-amount", "dice-sides", "icon-amount"} {
		editor := element(id)
		if !editor.Truthy() {
			continue
		}
		n, ok := roller.Quantity(editor.Get("value").String())
		bad := a.validate && !ok
		warning := element(id + "-error")
		warning.Set("hidden", !bad)
		if bad {
			attr(editor, "aria-invalid", "true")
			attr(editor, "aria-describedby", id+"-error")
		} else {
			editor.Call("removeAttribute", "aria-invalid")
			editor.Call("removeAttribute", "aria-describedby")
		}
		nodes("[data-field="+id+"]", func(node js.Value) {
			down := node.Call("getAttribute", "data-step").String() == "-1"
			node.Set("disabled", down && (!ok || n <= 1) || !down && n == roller.MaxQuantity)
		})
	}
	status := element("catalog-status")
	if status.Truthy() {
		value := ""
		if a.catalogState == "loading" {
			value = "<p class=\"muted\" role=\"status\">Loading pictograms…</p>"
		}
		if a.catalogState == "failed" {
			value = "<div class=\"catalog-status\"><p role=\"status\">Pictograms are unavailable.</p><button type=\"button\" class=\"secondary\" data-action=\"retry\">Retry</button></div>"
		}
		status.Set("innerHTML", value)
	}
}

type dieView struct {
	Text string
	Kept bool
}
type iconView struct{ Path, Name string }
type outcomeView struct {
	Item                  roller.Result
	Dice                  []dieView
	Icons                 []iconView
	Score                 int
	Total                 string
	Compact, CatalogReady bool
	CatalogMessage        string
}

func (a *app) outcome(item roller.Result, compact bool) string {
	score, kept := item.Score()
	data := outcomeView{Item: item, Score: score, Compact: compact, CatalogReady: a.catalogState == "ready", CatalogMessage: "Pictograms unavailable"}
	if a.catalogState == "loading" {
		data.CatalogMessage = "Loading pictograms…"
	}
	total, expanded := 0, false
	for index, die := range item.Dice {
		var values []string
		for _, value := range die {
			total += value
			values = append(values, strconv.Itoa(value))
		}
		expanded = expanded || len(die) > 1
		data.Dice = append(data.Dice, dieView{strings.Join(values, " + "), index == kept})
	}
	if item.Action.Mode == roller.All && !compact && (len(item.Dice) > 1 || expanded) {
		data.Total = strconv.Itoa(total)
	}
	for _, index := range item.Icons {
		if index < 0 || index >= len(a.catalog) {
			continue
		}
		path := a.catalog[index]
		parts := strings.Split(path, "/")
		name := strings.ReplaceAll(strings.TrimSuffix(parts[len(parts)-1], ".svg"), "-", " ")
		data.Icons = append(data.Icons, iconView{path, name})
	}
	return render(resultView, data)
}
func (a *app) paintResults() {
	count := len(a.sequence.History)
	element("history-panel").Set("hidden", count == 0)
	if count == 0 {
		element("latest-value").Set("className", "")
		element("latest-value").Set("innerHTML", "<p class=\"result-empty\"><span aria-hidden=\"true\">—</span><span class=\"sr-only\">No result yet.</span></p>")
		element("latest-label").Set("hidden", true)
		element("history-list").Set("innerHTML", "")
		return
	}
	latest := a.sequence.History[count-1]
	element("latest-value").Set("className", "result-value")
	element("latest-value").Set("innerHTML", fmt.Sprintf("<span class=\"sr-only\">Result %d. </span>", count)+a.outcome(latest, false))
	text("latest-label", latest.Action.Label())
	element("latest-label").Set("hidden", false)
	var output strings.Builder
	shown := count
	if !a.showHistory && shown > 3 {
		shown = 3
	}
	for index := count - 1; index >= count-shown; index-- {
		item := a.sequence.History[index]
		label := html.EscapeString(item.Action.Label())
		instant := time.UnixMilli(item.Action.Timestamp)
		utc := instant.UTC().Format("2006-01-02T15:04:05Z")
		local := instant.Local().Format("2006-01-02 15:04:05")
		fmt.Fprintf(&output, "<li class=\"history-item\"><div class=\"history-content\"><p class=\"history-meta\">%s<time datetime=\"%s\">%s</time></p>%s</div>", label, utc, local, a.outcome(item, true))
		if a.problem == "" {
			disabled := ""
			if item.Action.Tag == "show" && a.catalogState != "ready" {
				disabled = " disabled"
			}
			fmt.Fprintf(&output, "<button type=\"button\" class=\"secondary repeat\" aria-label=\"Repeat %s\" data-repeat=\"%d\"%s>Repeat</button>", label, index, disabled)
		}
		output.WriteString("</li>")
	}
	element("history-list").Set("innerHTML", output.String())
	element("history-toggle").Set("hidden", count <= 3)
	attr(element("history-toggle"), "aria-expanded", strconv.FormatBool(a.showHistory))
	label := "Show recent results"
	if !a.showHistory {
		label = fmt.Sprintf("View all %d results", count)
	}
	text("history-toggle", label)
}
func (a *app) runTool() {
	action, invalid := a.Prefs.Action()
	if invalid != "" {
		a.validate = true
		a.syncControls()
		browser.Call("focus", invalid)
		return
	}
	a.record(action, false)
}
func (a *app) record(action roller.Action, focus bool) {
	if a.problem != "" || action.Tag == "show" && a.catalogState != "ready" {
		return
	}
	action.Timestamp = time.Now().UnixMilli()
	a.sequence.Record(action, a.iconCount)
	a.paintResults()
	a.save()
	if focus {
		browser.Call("focus", "latest-result")
	}
}
func (a *app) setTool(tool string) {
	a.Prefs.Tool = tool
	a.validate = false
	a.paintControls()
	a.preferences()
	browser.Call("focus", "tool-tab-"+tool)
}
func (a *app) keydown(event js.Value) {
	tool := event.Get("target").Call("getAttribute", "data-tool")
	if !tool.Truthy() {
		return
	}
	tools := []string{"dice", "words", "icons"}
	index := 0
	for i, value := range tools {
		if value == tool.String() {
			index = i
		}
	}
	switch event.Get("key").String() {
	case "ArrowRight":
		index = (index + 1) % 3
	case "ArrowLeft":
		index = (index + 2) % 3
	case "Home":
		index = 0
	case "End":
		index = 2
	default:
		return
	}
	event.Call("preventDefault")
	a.setTool(tools[index])
}
func (a *app) input(event js.Value) {
	target := event.Get("target")
	id := target.Get("id").String()
	value := target.Get("value").String()
	switch id {
	case "table-search":
		a.tableOptions(value)
		return
	case "theme-desktop", "theme-mobile":
		a.theme = value
		a.paintTheme()
		if a.problem == "" {
			a.save()
		}
		return
	case "dice-amount":
		a.Prefs.Amount = value
	case "dice-sides":
		a.Prefs.Sides = value
	case "icon-amount":
		a.Prefs.IconAmount = value
	case "explode":
		a.Prefs.Explode = target.Get("checked").Bool()
	default:
		if target.Get("name").String() != "dice-result-mode" {
			return
		}
		a.Prefs.Mode = roller.Mode(value)
	}
	a.validate = false
	a.syncControls()
	a.preferences()
}
func (a *app) click(event js.Value) {
	target := event.Get("target").Call("closest", "button")
	if !target.Truthy() || target.Get("disabled").Bool() {
		return
	}
	get := func(key string) string {
		value := target.Call("getAttribute", key)
		if value.IsNull() {
			return ""
		}
		return value.String()
	}
	if id := get("data-close"); id != "" {
		browser.Call("setDialog", id, false)
		return
	}
	if tool := get("data-tool"); tool != "" {
		a.setTool(tool)
		return
	}
	if preset := get("data-preset"); preset != "" {
		a.Prefs.Sides = preset
		a.Prefs.Custom = false
		a.validate = false
		a.paintControls()
		a.preferences()
		document.Call("querySelector", "[data-preset=\""+preset+"\"]").Call("focus")
		return
	}
	if table := get("data-table"); table != "" {
		a.Prefs.Table = table
		browser.Call("setDialog", "table-dialog", false)
		a.paintControls()
		a.preferences()
		document.Call("querySelector", "[data-action=tables]").Call("focus")
		return
	}
	if index := get("data-repeat"); index != "" {
		n, err := strconv.Atoi(index)
		if err == nil && n < len(a.sequence.Actions) {
			a.record(a.sequence.Actions[n], true)
		}
		return
	}
	if delta := get("data-step"); delta != "" {
		id := get("data-field")
		editor := element(id)
		n, ok := roller.Quantity(editor.Get("value").String())
		d, _ := strconv.Atoi(delta)
		if ok {
			n += d
		} else {
			n = 1
		}
		editor.Set("value", strconv.Itoa(n))
		if id == "dice-amount" {
			a.Prefs.Amount = strconv.Itoa(n)
		} else {
			a.Prefs.IconAmount = strconv.Itoa(n)
		}
		a.validate = false
		a.syncControls()
		a.preferences()
		return
	}
	switch get("data-action") {
	case "custom":
		a.Prefs.Custom = true
		a.validate = false
		a.paintControls()
		a.preferences()
		browser.Call("focus", "dice-sides")
	case "history":
		a.showHistory = !a.showHistory
		a.paintResults()
	case "retry":
		a.catalogState = "loading"
		a.syncControls()
		browser.Call("loadCatalog", a.gotCatalog.Value)
	case "tables":
		element("table-search").Set("value", "")
		a.tableOptions("")
		browser.Call("setDialog", "table-dialog", true)
	case "share":
		encoded := a.sequence.Archive(a.theme).Encode()
		element("share-link").Set("value", browser.Call("shareBase").String()+"?state="+roller.LinkToken(encoded))
		text("share-status", "")
		browser.Call("setDialog", "share-dialog", true)
	case "copy":
		browser.Call("copyLink", element("share-link").Get("value"), a.copied.Value)
	case "clear":
		heading, description, confirm := "Clear history?", "This will remove "+roller.CountLabel(len(a.sequence.History), "result")+" and start a new sequence.", "Clear history"
		if a.problem != "" {
			heading, description, confirm = "Start new?", "This will replace the results stored in this browser.", "Start new"
		}
		text("clear-dialog-title", heading)
		text("clear-dialog-description", description)
		text("confirm-clear", confirm)
		browser.Call("setDialog", "clear-dialog", true)
	case "confirm-clear":
		a.sequence = freshSequence()
		a.problem = ""
		a.showHistory = false
		browser.Call("setDialog", "clear-dialog", false)
		a.paintProblem()
		a.syncControls()
		a.paintResults()
		a.save()
	case "saved":
		browser.Call("openSaved")
	case "update":
		browser.Call("reloadApp")
	}
}
func (a *app) tableOptions(query string) {
	query = strings.ToLower(strings.TrimSpace(query))
	recent := []string{a.Prefs.Table}
	seen := map[string]bool{a.Prefs.Table: true}
	for i := len(a.sequence.Actions) - 1; i >= 0 && len(recent) < 4; i-- {
		action := a.sequence.Actions[i]
		if action.Tag == "ask" && !seen[action.Table] {
			recent = append(recent, action.Table)
			seen[action.Table] = true
		}
	}
	var output strings.Builder
	options := func(names []string) {
		output.WriteString("<ul class=\"table-options\">")
		for _, name := range names {
			fmt.Fprintf(&output, "<li><button type=\"button\" class=\"table-option\" data-table=\"%s\" aria-pressed=\"%t\">%s</button></li>", html.EscapeString(name), name == a.Prefs.Table, html.EscapeString(roller.TableLabel(name)))
		}
		output.WriteString("</ul>")
	}
	if query == "" {
		output.WriteString("<div><h3>Recent</h3>")
		options(recent)
		output.WriteString("</div>")
	}
	var matches []string
	for _, name := range roller.Names {
		if strings.Contains(strings.ToLower(roller.TableLabel(name)), query) && (query != "" || !seen[name]) {
			matches = append(matches, name)
		}
	}
	if len(matches) == 0 {
		output.WriteString("<p class=\"muted\" role=\"status\">No matching tables.</p>")
	} else {
		if query == "" {
			output.WriteString("<h3>All tables</h3>")
		}
		options(matches)
	}
	element("table-results").Set("innerHTML", output.String())
}
