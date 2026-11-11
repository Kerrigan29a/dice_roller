import dice_roller/table_data
import gleam/dict
import gleam/list
import gleam/pair
import gleam/string

pub const default = "Mythic 2e: Actions"

pub fn catalog() -> dict.Dict(String, List(List(String))) {
  dict.from_list(table_data.entries)
}

pub fn names() -> List(String) {
  list.map(table_data.entries, pair.first)
}

pub fn label(name: String) -> String {
  name
  |> string.replace("Mythic 2e: Elements - ", "")
  |> string.replace("Mythic 2e: ", "")
  |> string.replace("Descritions", "Descriptions")
}
