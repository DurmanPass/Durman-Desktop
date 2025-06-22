import { mockIPC } from '@tauri-apps/api/mocks';
mockIPC((command, args) => {
    switch (command) {
        case 'get_window_label': return 'main';
        case 'create_password_generate_page': return true;
        case 'create_vault_window': return true;
        case 'close_all_windows': return true;
        case 'close_all_windows_except_vault_window': return true;
        case 'close_all_windows_except_main_window': return true;
        case 'close_current_window': return true;
        case 'restart_app': return true;
        default: throw new Error(`Unknown command: ${command}`);
    }
});