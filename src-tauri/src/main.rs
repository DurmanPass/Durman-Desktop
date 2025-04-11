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

#[tauri::command]
fn close_current_window(window: tauri::Window) {
    window.close().unwrap();
}

use std::fs::File;
use std::io::{Cursor, Write};
use std::path::Path;
use zip::write::{FileOptions, ZipWriter};
use zip::AesMode::Aes256;

// Команда для сохранения обычных файлов
#[tauri::command]
fn save_file(data: Vec<u8>, file_path: String) -> Result<String, String> {
    let path = Path::new(&file_path);
    let mut file = File::create(&path).map_err(|e| e.to_string())?;
    file.write_all(&data).map_err(|e| e.to_string())?;
    Ok(file_path)
}

// Команда для создания защищённого ZIP
#[tauri::command]
fn export_to_encrypted_zip(
    data: String,
    password: String,
    file_name: String,
) -> Result<String, String> {
    let mut buffer = Vec::new();
    let mut zip = ZipWriter::new(Cursor::new(&mut buffer));

    let options: FileOptions<()> = FileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .with_aes_encryption(Aes256, &password);
    zip.start_file("passwords.json", options)
        .map_err(|e| e.to_string())?;
    zip.write_all(data.as_bytes()).map_err(|e| e.to_string())?;

    let cursor = zip.finish().map_err(|e| e.to_string())?;
    let zip_data = cursor.into_inner();

    let file_path = Path::new(&file_name);
    let mut file = File::create(&file_path).map_err(|e| e.to_string())?;
    file.write_all(&zip_data).map_err(|e| e.to_string())?;

    Ok(file_name)
}

use tauri::{Window};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut};

#[tauri::command]
fn initialize_screenshot_blocking(window: Window) -> Result<(), String> {
    window
        .app_handle()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(move |_app, shortcut, event| {
                    let print_screen_shortcut = Shortcut::new(None, Code::PrintScreen);
                    if shortcut == &print_screen_shortcut {
                        match event.state() {
                            tauri_plugin_global_shortcut::ShortcutState::Pressed => {
                                // Блокируем действие PrintScreen
                            }
                            tauri_plugin_global_shortcut::ShortcutState::Released => {
                                // Ничего не делаем при отпускании
                            }
                        }
                    }
                })
                .build(),
        )
        .map_err(|e| format!("Ошибка инициализации плагина global-shortcut: {}", e))?;

    // Регистрация горячей клавиши PrintScreen
    let print_screen_shortcut = Shortcut::new(None, Code::PrintScreen);
    window
        .global_shortcut()
        .register(print_screen_shortcut)
        .map_err(|e| format!("Не удалось зарегистрировать PrintScreen: {}", e))?;

    // // Защита окна от захвата (только для Windows)
    // #[cfg(target_os = "windows")]
    // {
    //     use windows::Win32::Foundation::HWND;
    //     use windows::Win32::UI::WindowsAndMessaging::{SetWindowDisplayAffinity, WDA_EXCLUDEFROMCAPTURE};
    //
    //     let hwnd = window.hwnd().map_err(|e| e.to_string())?;
    //     unsafe {
    //         SetWindowDisplayAffinity(HWND(hwnd.0), WDA_EXCLUDEFROMCAPTURE)
    //             .map_err(|e| format!("Не удалось установить защиту окна: {:?}", e))?;
    //     }
    // }

    Ok(())
}
use std::fs;
// Команда для создания папки durmanpass
#[tauri::command]
fn create_durmanpass_dir() -> Result<(), String> {
    let config_dir = dirs::config_dir().ok_or("Could not resolve config directory")?;
    let durmanpass_dir = config_dir.join("com.durmanpass.app");

    if !durmanpass_dir.exists() {
        fs::create_dir_all(&durmanpass_dir).map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    Ok(())
}

fn main() {
    Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            create_password_generate_window,
            get_window_label,
            create_vault_window,
            close_all_except_vault_window,
            close_current_window,
            export_to_encrypted_zip,
            save_file,
            initialize_screenshot_blocking,
            create_durmanpass_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    passwordman_lib::run()
}
