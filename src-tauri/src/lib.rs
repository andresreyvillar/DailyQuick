mod calendar;
mod claude_cli;
mod commands;
mod fs;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use tauri::menu::{Menu, MenuItem, Submenu};
    use tauri::Emitter;

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Native menu-bar entry "DailyQuick → Ajustes…" that opens the in-app settings panel.
            let handle = app.handle();
            let settings = MenuItem::with_id(handle, "settings", "Ajustes…", true, None::<&str>)?;
            let submenu = Submenu::with_items(handle, "DailyQuick", true, &[&settings])?;
            let menu = Menu::default(handle)?;
            menu.append(&submenu)?;
            app.set_menu(menu)?;
            Ok(())
        })
        .on_menu_event(|app, event| {
            if event.id().as_ref() == "settings" {
                let _ = app.emit("open-settings", ());
            }
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::notes::ensure_day,
            commands::notes::write_note,
            commands::notes::read_note,
            commands::notes::list_day,
            commands::notes::create_project,
            commands::notes::delete_note,
            commands::notes::reveal_note,
            commands::notes::search_notes,
            commands::notes::list_events,
            commands::notes::list_calendars,
            commands::notes::read_forecast,
            commands::notes::read_diary,
            commands::notes::read_diary_source,
            commands::notes::set_diary_source,
            commands::notes::sync_project_diary,
            commands::notes::access_status,
            commands::notes::test_mail_access
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
