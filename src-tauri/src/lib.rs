mod calendar;
mod commands;
mod fs;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::notes::ensure_day,
            commands::notes::write_note,
            commands::notes::read_note,
            commands::notes::list_day,
            commands::notes::create_project,
            commands::notes::search_notes,
            commands::notes::list_events,
            commands::notes::list_calendars
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
