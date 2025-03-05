// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{Builder, Manager};

use tauri::{AppHandle, WebviewWindowBuilder};

use tauri::utils::config::WebviewUrl;

#[tauri::command]
async fn get_window_label(window: tauri::Window) -> String {
    window.label().to_string()
}
#[tauri::command]
async fn create_password_generate_window(handle: AppHandle) {
    let new_window = WebviewWindowBuilder::new(
        &handle,
        "password-generate-window",
        WebviewUrl::App("index.html".into()),
    )
        .title("Генерация надежного пароля")
        .resizable(false)
        .inner_size(450.0, 660.0)
        .fullscreen(false)
        .maximized(false)
        .maximizable(false)
        .always_on_top(true)
        .build()
        .expect("Ошибка при создании окна");

    new_window.show().unwrap();
}

#[tauri::command]
async fn create_vault_window(handle: AppHandle) {
    let new_window = WebviewWindowBuilder::new(
        &handle,
        "vault-window",
        WebviewUrl::App("index.html".into()),
    )
        .title("DurmanPass - Менеджер паролей")
        .maximized(true)
        .build()
        .expect("Ошибка при создании окна");

    new_window.show().unwrap();
}

#[tauri::command]
fn close_all_except_vault_window(app: AppHandle) {
    let windows = app.windows(); // Получаем все окна приложения

    for (label, window) in windows {
        if label != "vault-window" {
            window.close().unwrap_or_else(|err| {
                eprintln!("Ошибка при закрытии окна {}: {:?}", label, err);
            });
        }
    }
}

fn main() {

    Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_password_generate_window,
            get_window_label,
            create_vault_window,
            close_all_except_vault_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    passwordman_lib::run()
}
