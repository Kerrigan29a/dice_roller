import dice_roller/catalog.{Loading, Ready, Unavailable}
import dice_roller/session.{All}
import dice_roller/settings.{type Tool, Dice, Icons, Words}
import dice_roller/state.{type Message, type Model, SettingsChanged}
import dice_roller/tables
import gleam/bool
import gleam/dynamic/decode
import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/string
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import lustre/event

pub fn tab_id(tool: Tool) -> String {
  "tool-tab-" <> settings.tool_key(tool)
}

fn panel_id(tool: Tool) -> String {
  "tool-panel-" <> settings.tool_key(tool)
}

pub fn tabs(active: Tool) -> Element(Message) {
  html.div(
    [attr.class("modes"), attr.role("tablist"), attr.aria_label("Tools")],
    list.map(settings.tools, fn(choice) {
      let #(tool, label) = choice
      let selected = active == tool
      let index = case selected {
        True -> 0
        False -> -1
      }
      html.button(
        [
          attr.id(tab_id(tool)),
          attr.type_("button"),
          attr.role("tab"),
          attr.aria_selected(selected),
          attr.aria_controls(panel_id(tool)),
          attr.tabindex(index),
          event.on_click(SettingsChanged(settings.ToolSelected(tool))),
          tab_keys(tool),
        ],
        [html.text(label)],
      )
    }),
  )
}

fn tab_keys(tool: Tool) -> attr.Attribute(Message) {
  let decoder = {
    use key <- decode.field("key", decode.string)
    let target = case key, tool {
      "Home", _ | "ArrowLeft", Words | "ArrowRight", Icons -> Some(Dice)
      "ArrowLeft", Icons | "ArrowRight", Dice -> Some(Words)
      "End", _ | "ArrowLeft", Dice | "ArrowRight", Words -> Some(Icons)
      _, _ -> None
    }
    case target {
      Some(next) ->
        decode.success(event.handler(
          SettingsChanged(settings.ToolSelected(next)),
          True,
          False,
        ))
      None ->
        decode.failure(
          event.handler(state.ToolSubmitted, False, False),
          "tab navigation key",
        )
    }
  }
  event.advanced("keydown", decoder)
}

pub fn panels(model: Model) -> Element(Message) {
  html.div(
    [attr.class("workspace-controls")],
    list.map(settings.tools, fn(choice) {
      let #(tool, _) = choice
      let active = model.settings.tool == tool
      html.div(
        [
          attr.id(panel_id(tool)),
          attr.role("tabpanel"),
          attr.aria_labelledby(tab_id(tool)),
          attr.hidden(!active),
        ],
        case active {
          True -> [form(model)]
          False -> []
        },
      )
    }),
  )
}

fn form(model: Model) -> Element(Message) {
  let prefs = model.settings
  let #(controls, label, disabled) = case prefs.tool {
    Dice -> {
      let label = case settings.action(prefs), prefs.mode {
        Ok(action), _ -> "Roll " <> session.action_label(action)
        Error(_), All -> "Roll"
        Error(_), mode -> "Roll " <> session.mode_label(mode)
      }
      #(dice_controls(model), label, False)
    }
    Words -> #(table_choice(prefs.table), "Ask", False)
    Icons -> #(icon_controls(model), "Show icons", !state.has_catalog(model))
  }
  html.form(
    [attr.class("tool-form"), event.on_submit(fn(_) { state.ToolSubmitted })],
    [
      controls,
      html.button(
        [attr.type_("submit"), attr.class("primary"), attr.disabled(disabled)],
        [html.text(label)],
      ),
    ],
  )
}

fn table_choice(table: String) -> Element(Message) {
  html.div([attr.class("table-choice")], [
    html.div([], [
      html.p([attr.class("muted")], [html.text("Mythic 2e table")]),
      html.strong([], [html.text(tables.label(table))]),
    ]),
    html.button(
      [
        attr.type_("button"),
        attr.class("secondary"),
        event.on_click(state.DialogOpened(state.TableDialog)),
      ],
      [html.text("Change table")],
    ),
  ])
}

fn icon_controls(model: Model) -> Element(Message) {
  let status = case model.catalog {
    Loading ->
      html.p([attr.class("muted"), attr.role("status")], [
        html.text("Loading pictograms…"),
      ])
    Unavailable ->
      html.div([attr.class("catalog-status")], [
        html.p([attr.role("status")], [html.text("Pictograms are unavailable.")]),
        html.button(
          [
            attr.type_("button"),
            attr.class("secondary"),
            event.on_click(state.CatalogRetried),
          ],
          [html.text("Retry")],
        ),
      ])
    Ready(_) -> element.none()
  }
  html.div([attr.class("icon-controls")], [
    numeric_field(
      "icon-amount",
      "Pictogram count",
      model.settings.icon_count,
      model.validate,
      Some("pictograms"),
      fn(value) { SettingsChanged(settings.IconCountChanged(value)) },
    ),
    status,
  ])
}

fn dice_controls(model: Model) -> Element(Message) {
  let prefs = model.settings
  let presets =
    list.map([4, 6, 8, 10, 12, 20, 100], fn(sides) {
      let value = int.to_string(sides)
      html.button(
        [
          attr.type_("button"),
          attr.aria_pressed(
            bool.to_string(!prefs.custom && prefs.sides == value)
            |> string.lowercase,
          ),
          event.on_click(SettingsChanged(settings.PresetSelected(value))),
        ],
        [html.text("d" <> value)],
      )
    })
  let custom =
    html.button(
      [
        attr.type_("button"),
        attr.aria_pressed(bool.to_string(prefs.custom) |> string.lowercase),
        event.on_click(SettingsChanged(settings.CustomSelected)),
      ],
      [html.text("Custom")],
    )
  let sides = case prefs.custom {
    True ->
      numeric_field(
        "dice-sides",
        "Sides",
        prefs.sides,
        model.validate,
        None,
        fn(value) { SettingsChanged(settings.SidesChanged(value)) },
      )
    False -> element.none()
  }
  html.div([attr.class("dice-controls")], [
    html.fieldset([], [
      html.legend([], [html.text("Die type")]),
      html.div([attr.class("presets")], list.append(presets, [custom])),
    ]),
    html.div([attr.class("dice-fields")], [
      numeric_field(
        "dice-amount",
        "Dice count",
        prefs.dice_count,
        model.validate,
        Some("dice"),
        fn(value) { SettingsChanged(settings.DiceCountChanged(value)) },
      ),
      sides,
      html.label([attr.class("check-field")], [
        html.input([
          attr.type_("checkbox"),
          attr.checked(prefs.exploding),
          event.on_check(fn(checked) {
            SettingsChanged(settings.ExplodingChanged(checked))
          }),
        ]),
        html.text("Exploding"),
      ]),
    ]),
    result_options(prefs.mode),
  ])
}

fn result_options(selected: session.Mode) -> Element(Message) {
  html.div([attr.class("result-options")], [
    html.p([attr.id("dice-result-mode"), attr.class("field-label")], [
      html.text("Result"),
    ]),
    html.div(
      [
        attr.class("result-modes"),
        attr.role("radiogroup"),
        attr.aria_labelledby("dice-result-mode"),
      ],
      list.map(session.modes, fn(choice) {
        let #(mode, label) = choice
        html.label([attr.class("result-option")], [
          html.input([
            attr.type_("radio"),
            attr.name("dice-result-mode"),
            attr.checked(selected == mode),
            event.on_check(fn(_) {
              SettingsChanged(settings.ModeSelected(mode))
            }),
          ]),
          html.span([], [html.text(label)]),
        ])
      }),
    ),
  ])
}

fn numeric_field(
  id: String,
  label: String,
  value: String,
  validate: Bool,
  stepper: Option(String),
  change: fn(String) -> Message,
) -> Element(Message) {
  let number = settings.quantity(value)
  let error_id = id <> "-error"
  let #(validation, warning) = case validate && number == None {
    True -> #(
      [attr.aria_invalid("true"), attr.aria_describedby(error_id)],
      html.p(
        [attr.id(error_id), attr.class("field-error"), attr.role("alert")],
        [
          html.text("Enter a positive whole number up to 2,147,483,647."),
        ],
      ),
    )
    False -> #([], element.none())
  }
  let editor =
    html.input([
      attr.id(id),
      attr.type_("text"),
      attr.attribute("inputmode", "numeric"),
      attr.attribute("autocomplete", "off"),
      attr.value(value),
      event.on_input(change),
      ..validation
    ])
  let input = case stepper {
    Some(unit) ->
      html.div([attr.class("quantity-stepper")], [
        step(
          "Fewer " <> unit,
          "−",
          number,
          -1,
          number == None || number == Some(1),
          change,
        ),
        editor,
        step(
          "More " <> unit,
          "+",
          number,
          1,
          number == Some(settings.max_quantity),
          change,
        ),
      ])
    None -> editor
  }
  html.div([attr.class("field numeric-field")], [
    html.label([attr.for(id)], [html.text(label)]),
    input,
    warning,
  ])
}

fn step(
  label: String,
  glyph: String,
  number: Option(Int),
  delta: Int,
  blocked: Bool,
  change: fn(String) -> Message,
) -> Element(Message) {
  let next = case number {
    Some(value) -> value + delta
    None -> 1
  }
  html.button(
    [
      attr.type_("button"),
      attr.aria_label(label),
      attr.disabled(blocked),
      event.on_click(change(int.to_string(next))),
    ],
    [html.text(glyph)],
  )
}
