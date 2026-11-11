import dice_roller/tables
import gleam/dict
import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/result
import gleam/string
import prng/random.{type Generator, type Seed}

pub type Mode {
  All
  Highest
  Lowest
  Sum
}

pub const modes = [
  #(All, "All"),
  #(Highest, "Max"),
  #(Lowest, "Min"),
  #(Sum, "Sum"),
]

pub fn mode_label(mode: Mode) -> String {
  case mode {
    All -> "All"
    Highest -> "Max"
    Lowest -> "Min"
    Sum -> "Sum"
  }
}

pub type Action {
  Roll(sides: Int, count: Int, exploding: Bool, mode: Mode)
  Ask(table: String)
  Pictograms(count: Int)
}

pub type Recorded {
  Recorded(action: Action, timestamp: Int)
}

pub type Outcome {
  Dice(mode: Mode, dice: List(List(Int)))
  Word(String)
  Icons(List(Int))
}

pub type Item {
  Item(record: Recorded, outcome: Outcome)
}

pub opaque type Session {
  Session(
    initial_seed: Int,
    random: Seed,
    records: List(Recorded),
    history: List(Item),
  )
}

pub fn new(seed: Int) -> Session {
  Session(seed, random.new_seed(seed), [], [])
}

pub fn seed(session: Session) -> Int {
  session.initial_seed
}

pub fn records(session: Session) -> List(Recorded) {
  session.records
}

pub fn history(session: Session) -> List(Item) {
  session.history
}

pub type Sources {
  Sources(tables: dict.Dict(String, List(List(String))), icon_count: Int)
}

pub fn replay(seed: Int, records: List(Recorded), sources: Sources) -> Session {
  list.fold(records, new(seed), fn(session, entry) {
    record(session, entry, sources)
  })
}

pub fn record(session: Session, entry: Recorded, sources: Sources) -> Session {
  let session = Session(..session, records: [entry, ..session.records])
  case entry.action {
    Roll(sides, count, exploding, mode) -> {
      roll_die(sides, exploding, [])
      |> random.fixed_size_list(count)
      |> random.map(Dice(mode, _))
      |> add_outcome(session, entry, _)
    }
    Ask(name) -> {
      let word = case dict.get(sources.tables, name) {
        Ok(columns) -> pick_words(columns) |> random.map(string.join(_, " "))
        Error(_) -> random.constant("Table not found")
      }
      add_outcome(session, entry, random.map(word, Word))
    }
    Pictograms(count) -> {
      random.int(0, sources.icon_count - 1)
      |> random.fixed_size_list(count)
      |> random.map(Icons)
      |> add_outcome(session, entry, _)
    }
  }
}

fn add_outcome(
  session: Session,
  entry: Recorded,
  generator: Generator(Outcome),
) -> Session {
  let #(outcome, next) = random.step(generator, session.random)
  Session(..session, random: next, history: [
    Item(entry, outcome),
    ..session.history
  ])
}

fn roll_die(
  sides: Int,
  exploding: Bool,
  rolls: List(Int),
) -> Generator(List(Int)) {
  use value <- random.then(random.int(1, sides))
  let rolls = [value, ..rolls]
  case exploding && sides > 1 && value == sides {
    True -> roll_die(sides, exploding, rolls)
    False -> random.constant(list.reverse(rolls))
  }
}

fn pick_words(columns: List(List(String))) -> Generator(List(String)) {
  case columns {
    [] -> random.constant([])
    [options, ..rest] -> {
      let word =
        random.try_uniform(options) |> result.unwrap(random.constant(""))
      use first <- random.then(word)
      use others <- random.map(pick_words(rest))
      [first, ..others]
    }
  }
}

pub fn score(mode: Mode, dice: List(List(Int))) -> #(Option(Int), Option(Int)) {
  let totals = list.map(dice, int.sum)
  case mode, totals {
    All, _ -> #(None, None)
    Sum, _ -> #(Some(int.sum(totals)), None)
    _, [] -> #(None, None)
    _, [first, ..rest] -> {
      let better = case mode {
        Highest -> fn(a, b) { a > b }
        _ -> fn(a, b) { a < b }
      }
      let #(_, best, index) =
        list.fold(rest, #(1, first, 0), fn(acc, total) {
          let #(position, best, index) = acc
          case better(total, best) {
            True -> #(position + 1, total, position)
            False -> #(position + 1, best, index)
          }
        })
      #(Some(best), Some(index))
    }
  }
}

pub fn action_label(action: Action) -> String {
  case action {
    Roll(sides, count, exploding, mode) -> {
      let prefix = case mode {
        All -> ""
        _ -> mode_label(mode) <> " "
      }
      let suffix = case exploding {
        True -> "!"
        False -> ""
      }
      prefix <> int.to_string(count) <> "d" <> int.to_string(sides) <> suffix
    }
    Ask(name) -> tables.label(name)
    Pictograms(count) -> count_label(count, "pictogram")
  }
}

pub fn count_label(count: Int, noun: String) -> String {
  let suffix = case count {
    1 -> ""
    _ -> "s"
  }
  int.to_string(count) <> " " <> noun <> suffix
}
