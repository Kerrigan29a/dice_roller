import dice_roller/archive.{Newer, Saved}
import dice_roller/browser
import dice_roller/catalog.{Loading}
import dice_roller/controls
import dice_roller/session.{type Action, Recorded, Sources}
import dice_roller/settings.{
  CustomSelected, TableSelected, ThemeSelected, ToolSelected,
}
import dice_roller/state.{
  type Dialog, type Message, type Model, ActionRepeated, CatalogLoaded,
  CatalogRetried, ClearConfirmed, ClearDialog, ClipboardFinished, DialogClosed,
  DialogOpened, HistoryToggled, InvalidLink, LinkCopied, NewerFormat,
  SavedStateRequested, SettingsChanged, ShareDialog, StorageFailed, TableDialog,
  TablesSearched, ToolSubmitted, UpdateRequested,
}
import dice_roller/tables
import dice_roller/view
import gleam/option.{None, Some}
import lustre
import lustre/effect.{type Effect}

pub fn main() -> Nil {
  let app = lustre.application(init, update, view.render)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  browser.set_title("Dice Roller (v" <> state.version <> ")")
}

fn init(_flags: Nil) -> #(Model, Effect(Message)) {
  let from_link = browser.has_state()
  let stored = case from_link {
    True -> archive.open_link(browser.state_token())
    False -> archive.open(browser.stored_session())
  }
  let sources = Sources(tables.catalog(), browser.icon_count())
  let #(session, theme, problem) = case stored {
    Ok(Saved(seed, records, theme)) -> #(
      session.replay(seed, records, sources),
      theme,
      None,
    )
    Ok(Newer(version)) -> #(
      session.new(0),
      settings.System,
      Some(NewerFormat(version)),
    )
    Error(_) if from_link -> #(
      session.new(0),
      settings.System,
      Some(InvalidLink),
    )
    Error(_) -> #(session.new(browser.fresh_seed()), settings.System, None)
  }
  let settings =
    archive.preferences(browser.stored_preferences(), settings.defaults(theme))
  let model =
    state.Model(
      settings:,
      problem:,
      session:,
      sources:,
      catalog: Loading,
      save_issue: None,
      show_history: False,
      validate: False,
      table_query: "",
      share_link: "",
      clipboard: None,
    )
  let load = load_catalog()
  case problem {
    None -> #(model, effect.batch([load, save(model)]))
    Some(_) -> #(model, load)
  }
}

fn update(model: Model, message: Message) -> #(Model, Effect(Message)) {
  case message {
    CatalogLoaded(data) -> #(
      state.Model(
        ..model,
        catalog: catalog.open(data, model.sources.icon_count),
      ),
      effect.none(),
    )
    CatalogRetried -> #(state.Model(..model, catalog: Loading), load_catalog())
    SettingsChanged(change) -> {
      let settings = settings.apply(model.settings, change)
      let next = state.Model(..model, settings:, validate: False)
      let persist =
        effect.from(fn(dispatch) {
          browser.save_preferences(
            archive.encode_preferences(settings),
            fn(error) { dispatch(StorageFailed(error)) },
          )
        })
      let after = case change, model.settings.custom {
        ToolSelected(tool), _ -> focus(controls.tab_id(tool))
        CustomSelected, False -> focus("dice-sides")
        TableSelected(_), _ -> show_dialog(TableDialog, False)
        ThemeSelected(_), _ if model.problem == None -> save(next)
        _, _ -> effect.none()
      }
      #(next, effect.batch([persist, after]))
    }
    ToolSubmitted ->
      case settings.action(model.settings) {
        Ok(action) -> record(model, action, False)
        Error(field) -> #(state.Model(..model, validate: True), focus(field))
      }
    ActionRepeated(action) -> record(model, action, True)
    HistoryToggled -> #(
      state.Model(..model, show_history: !model.show_history),
      effect.none(),
    )
    TablesSearched(query) -> #(
      state.Model(..model, table_query: query),
      effect.none(),
    )
    DialogOpened(dialog) -> {
      let next = case dialog {
        ShareDialog -> {
          let token = archive.link_token(encode(model))
          state.Model(
            ..model,
            share_link: browser.share_base() <> "?state=" <> token,
            clipboard: None,
          )
        }
        TableDialog -> state.Model(..model, table_query: "")
        ClearDialog -> model
      }
      #(next, show_dialog(dialog, True))
    }
    DialogClosed(dialog) -> #(model, show_dialog(dialog, False))
    ClearConfirmed -> {
      let next =
        state.Model(
          ..model,
          session: session.new(browser.fresh_seed()),
          show_history: False,
          problem: None,
        )
      #(next, effect.batch([show_dialog(ClearDialog, False), save(next)]))
    }
    LinkCopied -> #(
      model,
      effect.from(fn(dispatch) {
        browser.copy_link(model.share_link, fn(success) {
          dispatch(ClipboardFinished(success))
        })
      }),
    )
    ClipboardFinished(success) -> #(
      state.Model(..model, clipboard: Some(success)),
      effect.none(),
    )
    StorageFailed(error) -> #(
      state.Model(..model, save_issue: Some(error)),
      effect.none(),
    )
    SavedStateRequested -> #(model, effect.from(fn(_) { browser.open_saved() }))
    UpdateRequested -> #(model, effect.from(fn(_) { browser.reload_app() }))
  }
}

fn record(
  model: Model,
  action: Action,
  focus_result: Bool,
) -> #(Model, Effect(Message)) {
  case state.allowed(model, action) {
    False -> #(model, effect.none())
    True -> {
      let entry = Recorded(action, browser.now())
      let next =
        state.Model(
          ..model,
          session: session.record(model.session, entry, model.sources),
        )
      let persist = save(next)
      case focus_result {
        True -> #(next, effect.batch([persist, focus("latest-result")]))
        False -> #(next, persist)
      }
    }
  }
}

fn encode(model: Model) -> String {
  archive.encode(model.session, model.settings.theme)
}

fn save(model: Model) -> Effect(Message) {
  let encoded = encode(model)
  effect.from(fn(dispatch) {
    browser.save_session(encoded, archive.link_token(encoded), fn(error) {
      dispatch(StorageFailed(error))
    })
  })
}

fn load_catalog() -> Effect(Message) {
  effect.from(fn(dispatch) {
    browser.load_catalog(fn(data) { dispatch(CatalogLoaded(data)) })
  })
}

fn focus(id: String) -> Effect(Message) {
  effect.before_paint(fn(_, _) { browser.focus(id) })
}

fn show_dialog(dialog: Dialog, visible: Bool) -> Effect(Message) {
  effect.before_paint(fn(_, _) {
    browser.set_dialog(state.dialog_id(dialog), visible)
  })
}
