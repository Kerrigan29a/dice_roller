import dice_roller/browser
import dice_roller/catalog.{type Catalog, Loading, Ready, Unavailable}
import dice_roller/session.{
  type Item, type Mode, type Outcome, All, Dice, Icons, Word,
}
import dice_roller/state.{type Message, type Model}
import gleam/dict
import gleam/int
import gleam/list
import gleam/option.{None, Some}
import gleam/result
import gleam/string
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import lustre/element/keyed
import lustre/event

pub fn latest(model: Model) -> Element(Message) {
  let history = session.history(model.session)
  let #(label, value) = case history {
    [item, ..] -> #(
      html.p([attr.class("result-meta")], [
        html.text(session.action_label(item.record.action)),
      ]),
      html.div([attr.class("result-value")], [
        sr_only("Result " <> int.to_string(list.length(history)) <> ". "),
        outcome(item.outcome, model.catalog, False),
      ]),
    )
    [] -> #(
      element.none(),
      html.p([attr.class("result-empty")], [
        html.span([attr.aria_hidden(True)], [html.text("—")]),
        sr_only("No result yet."),
      ]),
    )
  }
  html.section(
    [attr.class("result-panel"), attr.aria_labelledby("latest-result")],
    [
      html.div(
        [
          attr.class("result-content"),
          attr.aria_live("polite"),
          attr.aria_atomic(True),
        ],
        [
          html.div([attr.class("result-heading")], [
            html.h2([attr.id("latest-result"), attr.tabindex(-1)], [
              html.text("Latest result"),
            ]),
          ]),
          value,
          label,
        ],
      ),
    ],
  )
}

pub fn history(model: Model) -> Element(Message) {
  let history = session.history(model.session)
  let count = list.length(history)
  case history {
    [] -> element.none()
    _ -> {
      let visible = case model.show_history {
        True -> history
        False -> list.take(history, 3)
      }
      let rows =
        list.index_map(visible, fn(item, index) {
          #(int.to_string(count - index), history_item(model, item))
        })
      let toggle = case count > 3 {
        True -> history_toggle(model.show_history, count)
        False -> element.none()
      }
      html.aside(
        [attr.class("history-panel"), attr.aria_labelledby("history-heading")],
        [
          html.h2([attr.id("history-heading")], [html.text("History")]),
          keyed.ol([attr.class("history-list"), attr.id("history-list")], rows),
          toggle,
        ],
      )
    }
  }
}

fn history_toggle(expanded: Bool, count: Int) -> Element(Message) {
  let label = case expanded {
    True -> "Show recent results"
    False -> "View all " <> session.count_label(count, "result")
  }
  html.button(
    [
      attr.type_("button"),
      attr.class("secondary history-toggle"),
      attr.aria_expanded(expanded),
      attr.aria_controls("history-list"),
      event.on_click(state.HistoryToggled),
    ],
    [html.text(label)],
  )
}

fn history_item(model: Model, item: Item) -> Element(Message) {
  let label = session.action_label(item.record.action)
  let timestamp = item.record.timestamp
  let utc = browser.timestamp(timestamp, False) |> string.replace(" ", "T")
  let repeat = case state.editable(model) {
    True ->
      html.button(
        [
          attr.type_("button"),
          attr.class("secondary repeat"),
          attr.aria_label("Repeat " <> label),
          attr.disabled(!state.allowed(model, item.record.action)),
          event.on_click(state.ActionRepeated(item.record.action)),
        ],
        [html.text("Repeat")],
      )
    False -> element.none()
  }
  html.li([attr.class("history-item")], [
    html.div([attr.class("history-content")], [
      html.p([attr.class("history-meta")], [
        html.text(label),
        html.time([attr.attribute("datetime", utc <> "Z")], [
          html.text(browser.timestamp(timestamp, True)),
        ]),
      ]),
      outcome(item.outcome, model.catalog, True),
    ]),
    repeat,
  ])
}

fn outcome(
  value: Outcome,
  catalog: Catalog,
  compact: Bool,
) -> Element(Message) {
  case value {
    Word(word) -> html.p([attr.class("word-result")], [html.text(word)])
    Dice(mode, dice) -> dice_result(mode, dice, compact)
    Icons(indices) ->
      case catalog {
        Ready(paths) -> {
          let pictures = list.filter_map(indices, dict.get(paths, _))
          icon_grid(pictures, compact)
        }
        Loading ->
          html.p([attr.class("muted")], [html.text("Loading pictograms…")])
        Unavailable ->
          html.p([attr.class("muted")], [html.text("Pictograms unavailable")])
      }
  }
}

fn dice_result(
  mode: Mode,
  dice: List(List(Int)),
  compact: Bool,
) -> Element(Message) {
  let #(score, kept) = session.score(mode, dice)
  let #(aggregate, groups_class) = case score {
    Some(value) -> #(
      html.p([attr.class("aggregate-result")], [html.text(int.to_string(value))]),
      "dice-values dice-breakdown",
    )
    None -> #(element.none(), "dice-values")
  }
  let total = case
    mode == All
    && !compact
    && {
      list.length(dice) > 1
      || list.any(dice, fn(roll) { list.length(roll) > 1 })
    }
  {
    True -> {
      let value = dice |> list.map(int.sum) |> int.sum |> int.to_string
      html.p([attr.class("result-meta")], [html.text("Total " <> value)])
    }
    False -> element.none()
  }
  let groups =
    list.index_map(dice, fn(die, index) { die_group(die, kept == Some(index)) })
  html.div([attr.class("dice-result")], [
    aggregate,
    html.div([attr.class(groups_class)], groups),
    total,
  ])
}

fn die_group(rolls: List(Int), kept: Bool) -> Element(Message) {
  let value = rolls |> list.map(int.to_string) |> string.join(" + ")
  let #(classes, marker) = case kept {
    True -> #("die-group kept", sr_only("Kept die: "))
    False -> #("die-group", element.none())
  }
  html.span([attr.class(classes)], [marker, html.text(value)])
}

fn icon_grid(pictures: List(String), lazy: Bool) -> Element(Message) {
  html.div(
    [attr.class("pictograms")],
    list.map(pictures, fn(path) {
      let name =
        path
        |> string.split("/")
        |> list.last
        |> result.unwrap("Pictogram")
        |> string.replace(".svg", "")
        |> string.replace("-", " ")
      let loading = case lazy {
        True -> [attr.attribute("loading", "lazy")]
        False -> []
      }
      html.img([
        attr.class("pictogram"),
        attr.src(path),
        attr.alt(name),
        attr.title(name),
        ..loading
      ])
    }),
  )
}

fn sr_only(value: String) -> Element(Message) {
  html.span([attr.class("sr-only")], [html.text(value)])
}
