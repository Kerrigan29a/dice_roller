import dice_roller/build_info
import dice_roller/catalog.{type Catalog, Ready}
import dice_roller/session.{type Action, type Session, type Sources, Pictograms}
import dice_roller/settings.{type Change, type Settings}
import gleam/option.{type Option, None}

pub const version = build_info.version

pub type Problem {
  InvalidLink
  NewerFormat(Int)
}

pub type Dialog {
  TableDialog
  ShareDialog
  ClearDialog
}

pub fn dialog_id(dialog: Dialog) -> String {
  case dialog {
    TableDialog -> "table-dialog"
    ShareDialog -> "share-dialog"
    ClearDialog -> "clear-dialog"
  }
}

pub type Model {
  Model(
    settings: Settings,
    problem: Option(Problem),
    session: Session,
    sources: Sources,
    catalog: Catalog,
    save_issue: Option(String),
    show_history: Bool,
    validate: Bool,
    table_query: String,
    share_link: String,
    clipboard: Option(Bool),
  )
}

pub type Message {
  CatalogLoaded(String)
  CatalogRetried
  SettingsChanged(Change)
  ToolSubmitted
  ActionRepeated(Action)
  HistoryToggled
  TablesSearched(String)
  DialogOpened(Dialog)
  DialogClosed(Dialog)
  ClearConfirmed
  LinkCopied
  ClipboardFinished(Bool)
  StorageFailed(String)
  SavedStateRequested
  UpdateRequested
}

pub fn editable(model: Model) -> Bool {
  model.problem == None
}

pub fn has_catalog(model: Model) -> Bool {
  case model.catalog {
    Ready(_) -> True
    _ -> False
  }
}

pub fn allowed(model: Model, action: Action) -> Bool {
  editable(model)
  && case action {
    Pictograms(_) -> has_catalog(model)
    _ -> True
  }
}
