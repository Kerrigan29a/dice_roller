//// Versioned state shared through self-contained links and one local save.

import dice_roller/session.{
  type Action, type Mode, type Recorded, type Session, All, Ask, Highest, Lowest,
  Pictograms, Recorded, Roll, Sum,
}
import dice_roller/settings.{type Settings, type Theme, Settings}
import dice_roller/tables
import gleam/bit_array
import gleam/dynamic/decode.{type Decoder}
import gleam/json
import gleam/list
import gleam/result
import gleam/string
import gleam/uri

const format_name = "gleam-dice-roller"

// Version 2 uses prng 6.0.0 and the April 2026 icon catalog.
const schema_version = 2

pub type Archive {
  Saved(seed: Int, records: List(Recorded), theme: Theme)
  Newer(version: Int)
}

pub fn open(encoded: String) -> Result(Archive, Nil) {
  json.parse(encoded, archive_decoder()) |> result.replace_error(Nil)
}

pub fn open_link(token: String) -> Result(Archive, Nil) {
  use base64 <- result.try(uri.percent_decode(token))
  use bits <- result.try(bit_array.base64_decode(base64))
  use encoded <- result.try(bit_array.to_string(bits))
  open(encoded)
}

pub fn link_token(encoded: String) -> String {
  encoded
  |> bit_array.from_string
  |> bit_array.base64_encode(True)
  |> uri.percent_encode
  |> string.replace("+", "%2B")
}

fn archive_decoder() -> Decoder(Archive) {
  use format <- decode.field("format", decode.string)
  case format == format_name {
    False -> decode.failure(Newer(0), "Gleam Dice Roller snapshot")
    True -> {
      use version <- decode.field("version", decode.int)
      case version {
        2 -> {
          use seed <- decode.field("seed", decode.int)
          use records <- decode.field("actions", decode.list(record_decoder()))
          use theme <- decode.field(
            "theme",
            decode.map(decode.string, settings.theme_from_key),
          )
          decode.success(Saved(seed, records, theme))
        }
        _ if version > schema_version -> decode.success(Newer(version))
        _ ->
          decode.failure(Newer(version), "supported Gleam Dice Roller version")
      }
    }
  }
}

fn record_decoder() -> Decoder(Recorded) {
  use ts <- decode.field("ts", decode.int)
  use action <- decode.then(action_decoder())
  decode.success(Recorded(action, ts))
}

fn action_decoder() -> Decoder(Action) {
  use tag <- decode.field("tag", decode.string)
  case tag {
    "roll" -> {
      use sides <- decode.field("sides", decode.int)
      use count <- decode.field("amount", decode.int)
      use exploding <- decode.field("explode", decode.bool)
      use mode <- decode.then(mode_decoder())
      decode.success(Roll(sides, count, exploding, mode))
    }
    "ask" -> {
      use name <- decode.field("table", decode.string)
      decode.success(Ask(name))
    }
    "show" -> {
      use count <- decode.field("iconAmount", decode.int)
      decode.success(Pictograms(count))
    }
    _ -> decode.failure(Ask(""), "dice roller action")
  }
}

fn mode_decoder() -> Decoder(Mode) {
  use key <- decode.field("resultMode", decode.string)
  case key {
    "all" -> decode.success(All)
    "max" -> decode.success(Highest)
    "min" -> decode.success(Lowest)
    "sum" -> decode.success(Sum)
    _ -> decode.failure(All, "dice result mode")
  }
}

fn fallback(
  field: String,
  decoder: Decoder(a),
  default: a,
  next: fn(a) -> Decoder(b),
) -> Decoder(b) {
  let read = decode.field(field, decoder, decode.success)
  decode.then(decode.one_of(read, [decode.success(default)]), next)
}

pub fn encode(session: Session, theme: Theme) -> String {
  let records = list.reverse(session.records(session))
  json.object([
    #("format", json.string(format_name)),
    #("version", json.int(schema_version)),
    #("seed", json.int(session.seed(session))),
    #("actions", json.array(records, encode_record)),
    #("theme", json.string(settings.theme_key(theme))),
  ])
  |> json.to_string
}

fn encode_record(record: Recorded) -> json.Json {
  let ts = #("ts", json.int(record.timestamp))
  let fields = case record.action {
    Roll(sides, count, exploding, mode) -> {
      [
        #("tag", json.string("roll")),
        #("sides", json.int(sides)),
        #("amount", json.int(count)),
        #("explode", json.bool(exploding)),
        #("resultMode", json.string(mode_key(mode))),
        ts,
      ]
    }
    Ask(name) -> [
      #("tag", json.string("ask")),
      #("table", json.string(name)),
      ts,
    ]
    Pictograms(count) -> [
      #("tag", json.string("show")),
      #("iconAmount", json.int(count)),
      ts,
    ]
  }
  json.object(fields)
}

fn mode_key(mode: Mode) -> String {
  string.lowercase(session.mode_label(mode))
}

pub fn preferences(encoded: String, defaults: Settings) -> Settings {
  json.parse(encoded, settings_decoder(defaults))
  |> result.unwrap(defaults)
}

fn settings_decoder(defaults: Settings) -> Decoder(Settings) {
  use tool <- fallback(
    "tool",
    decode.map(decode.string, settings.tool_from_key),
    defaults.tool,
  )
  use count <- fallback("amount", decode.string, defaults.dice_count)
  use sides <- fallback("sides", decode.string, defaults.sides)
  use custom <- fallback("custom", decode.bool, defaults.custom)
  use exploding <- fallback("explode", decode.bool, defaults.exploding)
  use table <- fallback("table", decode.string, defaults.table)
  use icons <- fallback("iconAmount", decode.string, defaults.icon_count)
  use mode <- decode.then(
    decode.one_of(mode_decoder(), [decode.success(defaults.mode)]),
  )
  let table = case list.contains(tables.names(), table) {
    True -> table
    False -> defaults.table
  }
  decode.success(Settings(
    tool,
    count,
    sides,
    custom,
    exploding,
    mode,
    table,
    icons,
    defaults.theme,
  ))
}

pub fn encode_preferences(value: Settings) -> String {
  json.object([
    #("tool", json.string(settings.tool_key(value.tool))),
    #("amount", json.string(value.dice_count)),
    #("sides", json.string(value.sides)),
    #("custom", json.bool(value.custom)),
    #("explode", json.bool(value.exploding)),
    #("table", json.string(value.table)),
    #("iconAmount", json.string(value.icon_count)),
    #("resultMode", json.string(mode_key(value.mode))),
  ])
  |> json.to_string
}
