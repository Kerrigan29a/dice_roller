// Package roller contains browser-independent state, replay and random generation.
package roller

import (
	_ "embed"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"math/rand/v2"
	"net/url"
	"sort"
	"strconv"
	"strings"
)

const Format = "go-dice-roller"
const Schema = 2
const MaxQuantity = 2147483647

//go:embed tables.json
var tableData []byte

var Tables map[string][][]string
var Names []string

func init() {
	if err := json.Unmarshal(tableData, &Tables); err != nil {
		panic(err)
	}
	for name := range Tables {
		Names = append(Names, name)
	}
	sort.Strings(Names)
}

type Mode string

const (
	All Mode = "all"
	Max Mode = "max"
	Min Mode = "min"
	Sum Mode = "sum"
)

func (m Mode) Label() string {
	switch m {
	case Max:
		return "Max"
	case Min:
		return "Min"
	case Sum:
		return "Sum"
	default:
		return "All"
	}
}

type Action struct {
	Tag        string `json:"tag"`
	Sides      int    `json:"sides,omitempty"`
	Amount     int    `json:"amount,omitempty"`
	Explode    bool   `json:"explode,omitempty"`
	Mode       Mode   `json:"resultMode,omitempty"`
	Table      string `json:"table,omitempty"`
	IconAmount int    `json:"iconAmount,omitempty"`
	Timestamp  int64  `json:"ts"`
}

func (a Action) Label() string {
	switch a.Tag {
	case "ask":
		return TableLabel(a.Table)
	case "show":
		return CountLabel(a.IconAmount, "pictogram")
	default:
		prefix, suffix := "", ""
		if a.Mode != All {
			prefix = a.Mode.Label() + " "
		}
		if a.Explode {
			suffix = "!"
		}
		return fmt.Sprintf("%s%dd%d%s", prefix, a.Amount, a.Sides, suffix)
	}
}

func TableLabel(name string) string {
	name = strings.TrimPrefix(name, "Mythic 2e: ")
	name = strings.TrimPrefix(name, "Elements - ")
	return strings.ReplaceAll(name, "Descritions", "Descriptions")
}

func CountLabel(n int, noun string) string {
	if n != 1 {
		noun += "s"
	}
	return fmt.Sprintf("%d %s", n, noun)
}

type Archive struct {
	Format  string   `json:"format"`
	Version int      `json:"version"`
	Seed    int      `json:"seed"`
	Actions []Action `json:"actions"`
	Theme   string   `json:"theme"`
}

type NewerVersion int

func (v NewerVersion) Error() string { return fmt.Sprintf("Newer state format: %d", v) }

func Decode(text string) (Archive, error) {
	var saved Archive
	if err := json.Unmarshal([]byte(text), &saved); err != nil {
		return saved, err
	}
	if saved.Format != Format {
		return saved, errors.New("unknown state format")
	}
	if saved.Version > Schema {
		return saved, NewerVersion(saved.Version)
	}
	if saved.Version != Schema {
		return saved, errors.New("unsupported state format")
	}
	for _, action := range saved.Actions {
		if !action.Valid() {
			return saved, errors.New("invalid action")
		}
	}
	return saved, nil
}

func DecodeLink(token string) (Archive, error) {
	text, err := url.PathUnescape(token)
	if err != nil {
		return Archive{}, err
	}
	decoded, err := base64.StdEncoding.DecodeString(text)
	if err != nil {
		return Archive{}, err
	}
	return Decode(string(decoded))
}

func (a Archive) Encode() string {
	encoded, err := json.Marshal(a)
	if err != nil {
		panic(err)
	}
	return string(encoded)
}

func LinkToken(text string) string {
	return url.QueryEscape(base64.StdEncoding.EncodeToString([]byte(text)))
}

func Quantity(text string) (int, bool) {
	value, err := strconv.ParseInt(text, 10, 32)
	return int(value), err == nil && value > 0
}

func (a Action) Valid() bool {
	positive := func(n int) bool { return n > 0 && n <= MaxQuantity }
	switch a.Tag {
	case "roll":
		return positive(a.Sides) && positive(a.Amount) && (a.Mode == All || a.Mode == Max || a.Mode == Min || a.Mode == Sum)
	case "ask":
		_, ok := Tables[a.Table]
		return ok
	case "show":
		return positive(a.IconAmount)
	default:
		return false
	}
}

type Result struct {
	Action Action
	Dice   [][]int
	Word   string
	Icons  []int
}

// Sequence owns its generator. No global random state is used during replay.
type Sequence struct {
	Seed    int
	Actions []Action
	History []Result // oldest first, as in the archive
	random  *rand.Rand
}

func New(seed int) *Sequence {
	return &Sequence{Seed: seed, Actions: []Action{}, random: rand.New(rand.NewPCG(uint64(seed), 0))}
}

func Replay(saved Archive, iconCount int) *Sequence {
	sequence := New(saved.Seed)
	for _, action := range saved.Actions {
		sequence.Record(action, iconCount)
	}
	return sequence
}

func (s *Sequence) Record(action Action, iconCount int) {
	result := Result{Action: action}
	switch action.Tag {
	case "roll":
		for range action.Amount {
			var die []int
			for {
				value := s.random.IntN(action.Sides) + 1
				die = append(die, value)
				if !action.Explode || action.Sides == 1 || value != action.Sides {
					break
				}
			}
			result.Dice = append(result.Dice, die)
		}
	case "ask":
		var words []string
		for _, column := range Tables[action.Table] {
			words = append(words, column[s.random.IntN(len(column))])
		}
		result.Word = strings.Join(words, " ")
	case "show":
		for range action.IconAmount {
			result.Icons = append(result.Icons, s.random.IntN(iconCount))
		}
	}
	s.Actions = append(s.Actions, action)
	s.History = append(s.History, result)
}

func (s *Sequence) Archive(theme string) Archive {
	return Archive{Format, Schema, s.Seed, s.Actions, theme}
}

func (r Result) Score() (score, kept int) {
	kept = -1
	for index, die := range r.Dice {
		total := 0
		for _, value := range die {
			total += value
		}
		switch r.Action.Mode {
		case Sum:
			score += total
		case Max, Min:
			if kept == -1 || r.Action.Mode == Max && total > score || r.Action.Mode == Min && total < score {
				score, kept = total, index
			}
		}
	}
	return
}

type Preferences struct {
	Tool       string `json:"tool"`
	Amount     string `json:"amount"`
	Sides      string `json:"sides"`
	Custom     bool   `json:"custom"`
	Explode    bool   `json:"explode"`
	Table      string `json:"table"`
	IconAmount string `json:"iconAmount"`
	Mode       Mode   `json:"resultMode"`
}

func Defaults() Preferences {
	return Preferences{Tool: "dice", Amount: "1", Sides: "6", Table: "Mythic 2e: Actions", IconAmount: "3", Mode: All}
}

func ReadPreferences(text string) Preferences {
	prefs := Defaults()
	if err := json.Unmarshal([]byte(text), &prefs); err != nil {
		return Defaults()
	}
	if prefs.Tool != "dice" && prefs.Tool != "words" && prefs.Tool != "icons" {
		prefs.Tool = "dice"
	}
	if _, ok := Tables[prefs.Table]; !ok {
		prefs.Table = Defaults().Table
	}
	if prefs.Mode != All && prefs.Mode != Max && prefs.Mode != Min && prefs.Mode != Sum {
		prefs.Mode = All
	}
	return prefs
}

func (p Preferences) Action() (Action, string) {
	switch p.Tool {
	case "words":
		return Action{Tag: "ask", Table: p.Table}, ""
	case "icons":
		if count, ok := Quantity(p.IconAmount); ok {
			return Action{Tag: "show", IconAmount: count}, ""
		}
		return Action{}, "icon-amount"
	default:
		count, ok := Quantity(p.Amount)
		if !ok {
			return Action{}, "dice-amount"
		}
		sides, ok := Quantity(p.Sides)
		if !ok {
			return Action{}, "dice-sides"
		}
		return Action{Tag: "roll", Sides: sides, Amount: count, Explode: p.Explode, Mode: p.Mode}, ""
	}
}
