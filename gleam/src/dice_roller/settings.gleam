import dice_roller/session.{type Action, type Mode, All, Ask, Pictograms, Roll}
import dice_roller/tables
import gleam/int
import gleam/option.{type Option, None, Some}
import gleam/string

pub const max_quantity = 2_147_483_647

pub type Tool {
  Dice
  Words
  Icons
}

pub const tools = [#(Dice, "Dice"), #(Words, "Words"), #(Icons, "Pictograms")]

pub type Theme {
  System
  Light
  Dark
}

pub const themes = [#(System, "System"), #(Light, "Light"), #(Dark, "Dark")]

pub type Settings {
  Settings(
    tool: Tool,
    dice_count: String,
    sides: String,
    custom: Bool,
    exploding: Bool,
    mode: Mode,
    table: String,
    icon_count: String,
    theme: Theme,
  )
}

pub fn defaults(theme: Theme) -> Settings {
  Settings(Dice, "1", "6", False, False, All, tables.default, "3", theme)
}

pub type Change {
  ToolSelected(Tool)
  DiceCountChanged(String)
  PresetSelected(String)
  CustomSelected
  SidesChanged(String)
  ExplodingChanged(Bool)
  ModeSelected(Mode)
  TableSelected(String)
  IconCountChanged(String)
  ThemeSelected(Theme)
}

pub fn apply(settings: Settings, change: Change) -> Settings {
  case change {
    ToolSelected(tool) -> Settings(..settings, tool: tool)
    DiceCountChanged(count) -> Settings(..settings, dice_count: count)
    PresetSelected(sides) -> Settings(..settings, sides: sides, custom: False)
    CustomSelected -> Settings(..settings, custom: True)
    SidesChanged(sides) -> Settings(..settings, sides: sides)
    ExplodingChanged(exploding) -> Settings(..settings, exploding: exploding)
    ModeSelected(mode) -> Settings(..settings, mode: mode)
    TableSelected(table) -> Settings(..settings, table: table)
    IconCountChanged(count) -> Settings(..settings, icon_count: count)
    ThemeSelected(theme) -> Settings(..settings, theme: theme)
  }
}

pub fn tool_key(tool: Tool) -> String {
  case tool {
    Dice -> "dice"
    Words -> "words"
    Icons -> "icons"
  }
}

pub fn tool_from_key(key: String) -> Tool {
  case key {
    "words" -> Words
    "icons" -> Icons
    _ -> Dice
  }
}

pub fn theme_key(theme: Theme) -> String {
  case theme {
    System -> "auto"
    Light -> "light"
    Dark -> "dark"
  }
}

pub fn theme_from_key(key: String) -> Theme {
  case string.lowercase(key) {
    "light" -> Light
    "dark" -> Dark
    _ -> System
  }
}

pub fn quantity(input: String) -> Option(Int) {
  case int.parse(input) {
    Ok(value) if value > 0 && value <= max_quantity -> Some(value)
    _ -> None
  }
}

pub fn action(settings: Settings) -> Result(Action, String) {
  case settings.tool {
    Dice ->
      case quantity(settings.dice_count), quantity(settings.sides) {
        Some(count), Some(sides) ->
          Ok(Roll(sides, count, settings.exploding, settings.mode))
        None, _ -> Error("dice-amount")
        _, None -> Error("dice-sides")
      }
    Words -> Ok(Ask(settings.table))
    Icons ->
      case quantity(settings.icon_count) {
        Some(count) -> Ok(Pictograms(count))
        None -> Error("icon-amount")
      }
  }
}
