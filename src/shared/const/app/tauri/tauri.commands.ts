export const TauriCommands = {
    SAVE_FILE: 'save_file',
    EXPORT_TO_ENCRYPTED_ZIP: 'export_to_encrypted_zip',
    WINDOW_SERVICE: {
        GET_WINDOW_LABEL: 'get_window_label',
        CREATE_PASSWORD_GENERATE_PAGE: 'create_password_generate_window',
        CREATE_VAULT_WINDOW: 'create_vault_window',
        CLOSE_ALL_WINDOWS: 'close_all_windows',
        CLOSE_ALL_WINDOWS_EXCEPT_VAULT_WINDOW: 'close_all_except_vault_window',
        CLOSE_CURRENT_WINDOW: 'close_current_window'
    },
    SCREENSHOT_PROTECTION_SERVICE: {
       INITIALIZE_SCREENSHOT_BLOCKING: 'initialize_screenshot_blocking'
    },
    APP_DATA_SERVICE: {
        CREATE_DURMANPASS_DIR: 'create_durmanpass_dir'
    }
} as const;