import dice_roller/controls
import dice_roller/results
import dice_roller/session.{Ask}
import dice_roller/settings
import dice_roller/state.{
  type Message, type Model, ClearConfirmed, ClearDialog, DialogClosed,
  DialogOpened, InvalidLink, LinkCopied, NewerFormat, SavedStateRequested,
  SettingsChanged, ShareDialog, TableDialog, UpdateRequested,
}
import dice_roller/tables
import gleam/bool
import gleam/int
import gleam/list
import gleam/option.{None, Some}
import gleam/string
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import lustre/event

pub fn render(model: Model) -> Element(Message) {
  let #(tabs, panels) = case state.editable(model) {
    True -> #(controls.tabs(model.settings.tool), controls.panels(model))
    False -> #(element.none(), element.none())
  }
  html.div(
    [
      attr.class("app-shell"),
      attr.attribute("data-theme", settings.theme_key(model.settings.theme)),
    ],
    [
      header(model),
      html.main([attr.class("page")], [
        problem_banner(model),
        save_notice(model),
        html.div([attr.class("workspace")], [
          tabs,
          panels,
          results.latest(model),
        ]),
        results.history(model),
      ]),
      table_dialog(model),
      share_dialog(model),
      clear_dialog(model),
    ],
  )
}

fn header(model: Model) -> Element(Message) {
  let clear = case state.editable(model) {
    True -> button("Clear history…", "menu-action", DialogOpened(ClearDialog))
    False -> element.none()
  }
  html.header([attr.class("topbar")], [
    html.div([attr.class("topbar-inner")], [
      html.div([attr.class("brand")], [
        html.img([
          attr.class("brand-icon"),
          attr.src("../assets/brand-die.png"),
          attr.alt(""),
          attr.attribute("width", "36"),
          attr.attribute("height", "36"),
        ]),
        html.div([attr.class("brand-name")], [
          html.h1([], [html.text("Dice Roller")]),
          html.small([attr.class("muted app-version")], [
            html.text("v" <> state.version),
          ]),
        ]),
      ]),
      html.div([attr.class("header-actions")], [
        html.div([attr.class("header-utilities")], [
          html.button(
            [
              attr.type_("button"),
              attr.class("secondary"),
              attr.disabled(model.problem != None),
              event.on_click(DialogOpened(ShareDialog)),
            ],
            [html.text("Share")],
          ),
          html.div([attr.class("desktop-theme")], [
            theme_control(model.settings.theme, "theme-desktop"),
          ]),
        ]),
        html.div([attr.class("history-action")], [clear]),
        html.details([attr.class("more-menu")], [
          html.summary([], [
            html.text("More"),
            html.span([attr.class("more-icon"), attr.aria_hidden(True)], [
              html.text("⋯"),
            ]),
          ]),
          html.div([attr.class("more-menu-content")], [
            theme_control(model.settings.theme, "theme-mobile"),
            clear,
          ]),
        ]),
      ]),
    ]),
  ])
}

fn theme_control(selected: settings.Theme, id: String) -> Element(Message) {
  html.div([attr.class("theme-control")], [
    html.label([attr.for(id)], [html.text("Theme:")]),
    html.select(
      [
        attr.id(id),
        attr.aria_label("Theme"),
        event.on_input(fn(value) {
          SettingsChanged(
            settings.ThemeSelected(settings.theme_from_key(value)),
          )
        }),
      ],
      list.map(settings.themes, fn(choice) {
        let #(theme, label) = choice
        html.option(
          [
            attr.value(settings.theme_key(theme)),
            attr.selected(theme == selected),
          ],
          label,
        )
      }),
    ),
  ])
}

fn problem_banner(model: Model) -> Element(Message) {
  let back = button("Open saved results", "secondary", SavedStateRequested)
  case model.problem {
    Some(InvalidLink) ->
      banner("Shared link unavailable", "This link could not be opened.", [back])
    Some(NewerFormat(version)) ->
      banner(
        "Newer version detected",
        "These results use format "
          <> int.to_string(version)
          <> ". Try updating Dice Roller to open it.",
        [
          button("Update and reload", "secondary", UpdateRequested),
          back,
          button("Start new…", "secondary", DialogOpened(ClearDialog)),
        ],
      )
    None -> element.none()
  }
}

fn banner(
  heading: String,
  description: String,
  actions: List(Element(Message)),
) -> Element(Message) {
  html.section([attr.class("problem-banner")], [
    html.div([], [
      html.h2([], [html.text(heading)]),
      html.p([attr.class("muted")], [html.text(description)]),
    ]),
    html.div([attr.class("button-row")], actions),
  ])
}

fn save_notice(model: Model) -> Element(Message) {
  case model.save_issue {
    Some(issue) ->
      html.div([attr.class("notice")], [
        html.p([attr.role("status")], [html.text(issue)]),
      ])
    None -> element.none()
  }
}

fn table_dialog(model: Model) -> Element(Message) {
  let names = tables.names()
  let asked =
    list.filter_map(session.records(model.session), fn(record) {
      case record.action {
        Ask(name) -> Ok(name)
        _ -> Error(Nil)
      }
    })
  let recent =
    [model.settings.table, ..asked]
    |> list.filter(list.contains(names, _))
    |> list.unique
    |> list.take(4)
  let query = model.table_query |> string.trim |> string.lowercase
  let matches =
    list.filter(names, fn(name) {
      string.contains(string.lowercase(tables.label(name)), query)
      && { query != "" || !list.contains(recent, name) }
    })
  let recent_options = case query, recent {
    "", [_, ..] ->
      html.div([], [
        html.h3([], [html.text("Recent")]),
        table_options(recent, model.settings.table),
      ])
    _, _ -> element.none()
  }
  let matching_options = case matches {
    [] ->
      html.p([attr.class("muted"), attr.role("status")], [
        html.text("No matching tables."),
      ])
    _ -> {
      let heading = case query {
        "" -> html.h3([], [html.text("All tables")])
        _ -> element.none()
      }
      html.div([], [heading, table_options(matches, model.settings.table)])
    }
  }
  html.dialog(
    [
      attr.id(state.dialog_id(TableDialog)),
      attr.class("dialog table-dialog"),
      attr.aria_labelledby("table-dialog-title"),
    ],
    [
      html.div([attr.class("dialog-heading")], [
        html.h2([attr.id("table-dialog-title")], [html.text("Choose a table")]),
        button("Cancel", "secondary", DialogClosed(TableDialog)),
      ]),
      html.div([attr.class("field")], [
        html.label([attr.for("table-search")], [
          html.text("Search Mythic 2e tables"),
        ]),
        html.input([
          attr.id("table-search"),
          attr.type_("search"),
          attr.attribute("autofocus", ""),
          attr.value(model.table_query),
          event.on_input(state.TablesSearched),
        ]),
      ]),
      html.div([attr.class("table-results")], [recent_options, matching_options]),
    ],
  )
}

fn table_options(names: List(String), selected: String) -> Element(Message) {
  html.ul(
    [attr.class("table-options")],
    list.map(names, fn(name) {
      html.li([], [
        html.button(
          [
            attr.type_("button"),
            attr.class("table-option"),
            attr.aria_pressed(
              bool.to_string(name == selected) |> string.lowercase,
            ),
            event.on_click(SettingsChanged(settings.TableSelected(name))),
          ],
          [html.text(tables.label(name))],
        ),
      ])
    }),
  )
}

fn share_dialog(model: Model) -> Element(Message) {
  let status = case model.clipboard {
    Some(True) -> "Link copied."
    Some(False) ->
      "Copy failed. The link is selected so you can copy it manually."
    None -> ""
  }
  html.dialog(
    [
      attr.id(state.dialog_id(ShareDialog)),
      attr.class("dialog"),
      attr.aria_labelledby("share-dialog-title"),
    ],
    [
      html.h2([attr.id("share-dialog-title")], [html.text("Share results")]),
      html.p([attr.class("muted")], [
        html.text(
          "Open this link in another browser to reproduce these results and continue rolling.",
        ),
      ]),
      html.div([attr.class("field")], [
        html.label([attr.for("share-link")], [html.text("Results link")]),
        html.input([
          attr.id("share-link"),
          attr.type_("text"),
          attr.readonly(True),
          attr.value(model.share_link),
        ]),
      ]),
      html.p([attr.role("status"), attr.class("share-status")], [
        html.text(status),
      ]),
      html.div([attr.class("dialog-actions")], [
        button("Close", "secondary", DialogClosed(ShareDialog)),
        button("Copy link", "primary", LinkCopied),
      ]),
    ],
  )
}

fn clear_dialog(model: Model) -> Element(Message) {
  let #(heading, description, confirm) = case model.problem {
    Some(_) -> #(
      "Start new?",
      "This will replace the results stored in this browser.",
      "Start new",
    )
    None -> {
      let count = model.session |> session.history |> list.length
      #(
        "Clear history?",
        "This will remove "
          <> session.count_label(count, "result")
          <> " and start a new sequence.",
        "Clear history",
      )
    }
  }
  html.dialog(
    [
      attr.id(state.dialog_id(ClearDialog)),
      attr.class("dialog"),
      attr.aria_labelledby("clear-dialog-title"),
      attr.aria_describedby("clear-dialog-description"),
    ],
    [
      html.h2([attr.id("clear-dialog-title")], [html.text(heading)]),
      html.p([attr.id("clear-dialog-description")], [html.text(description)]),
      html.div([attr.class("dialog-actions")], [
        html.button(
          [
            attr.type_("button"),
            attr.class("secondary"),
            attr.attribute("autofocus", ""),
            event.on_click(DialogClosed(ClearDialog)),
          ],
          [html.text("Cancel")],
        ),
        button(confirm, "danger", ClearConfirmed),
      ]),
    ],
  )
}

fn button(label: String, class: String, message: Message) -> Element(Message) {
  html.button(
    [attr.type_("button"), attr.class(class), event.on_click(message)],
    [html.text(label)],
  )
}
