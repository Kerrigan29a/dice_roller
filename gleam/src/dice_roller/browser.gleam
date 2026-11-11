@external(javascript, "./browser_ffi.mjs", "hasState")
pub fn has_state() -> Bool

@external(javascript, "./browser_ffi.mjs", "stateToken")
pub fn state_token() -> String

@external(javascript, "./browser_ffi.mjs", "shareBase")
pub fn share_base() -> String

@external(javascript, "./browser_ffi.mjs", "storedSession")
pub fn stored_session() -> String

@external(javascript, "./browser_ffi.mjs", "storedPreferences")
pub fn stored_preferences() -> String

@external(javascript, "./browser_ffi.mjs", "iconCount")
pub fn icon_count() -> Int

@external(javascript, "./browser_ffi.mjs", "freshSeed")
pub fn fresh_seed() -> Int

@external(javascript, "./browser_ffi.mjs", "now")
pub fn now() -> Int

@external(javascript, "./browser_ffi.mjs", "timestamp")
pub fn timestamp(milliseconds: Int, local: Bool) -> String

@external(javascript, "./browser_ffi.mjs", "loadCatalog")
pub fn load_catalog(receive: fn(String) -> Nil) -> Nil

@external(javascript, "./browser_ffi.mjs", "saveSession")
pub fn save_session(
  json: String,
  token: String,
  report: fn(String) -> Nil,
) -> Nil

@external(javascript, "./browser_ffi.mjs", "savePreferences")
pub fn save_preferences(json: String, report: fn(String) -> Nil) -> Nil

@external(javascript, "./browser_ffi.mjs", "openSaved")
pub fn open_saved() -> Nil

@external(javascript, "./browser_ffi.mjs", "copyLink")
pub fn copy_link(link: String, receive: fn(Bool) -> Nil) -> Nil

@external(javascript, "./browser_ffi.mjs", "focus")
pub fn focus(id: String) -> Nil

@external(javascript, "./browser_ffi.mjs", "setDialog")
pub fn set_dialog(id: String, visible: Bool) -> Nil

@external(javascript, "./browser_ffi.mjs", "reloadApp")
pub fn reload_app() -> Nil

@external(javascript, "./browser_ffi.mjs", "setTitle")
pub fn set_title(title: String) -> Nil
