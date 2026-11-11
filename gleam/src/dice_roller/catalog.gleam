import gleam/dict.{type Dict}
import gleam/dynamic/decode.{type Decoder}
import gleam/json
import gleam/list
import gleam/string

pub type Catalog {
  Loading
  Ready(Dict(Int, String))
  Unavailable
}

pub fn open(input: String, count: Int) -> Catalog {
  case json.parse(input, decoder()) {
    Ok(paths) if count > 0 ->
      case list.length(paths) == count {
        True -> Ready(index_paths(paths))
        False -> Unavailable
      }
    _ -> Unavailable
  }
}

fn index_paths(paths: List(String)) -> Dict(Int, String) {
  paths |> list.index_map(fn(path, index) { #(index, path) }) |> dict.from_list
}

fn decoder() -> Decoder(List(String)) {
  let authors = decode.dict(decode.string, decode.list(decode.string))
  use sizes <- decode.field("icons", decode.dict(decode.string, authors))
  let paths =
    sizes
    |> dict.to_list
    |> list.flat_map(fn(size) {
      size.1
      |> dict.to_list
      |> list.flat_map(fn(author) {
        let prefix =
          "./icons/ffffff/transparent/" <> size.0 <> "/" <> author.0 <> "/"
        list.map(author.1, fn(name) { prefix <> name <> ".svg" })
      })
    })
    |> list.sort(string.compare)
  decode.success(paths)
}
