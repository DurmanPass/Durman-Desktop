// import {getTestBed, TestBed} from '@angular/core/testing';
// import { mockIPC } from '@tauri-apps/api/mocks';
// import { invoke } from '@tauri-apps/api/core';
// import {WindowService} from "../../services/window.service";
// import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
//
// // Мокирование Tauri-команд
// beforeAll(() => {
//     mockIPC((command, args) => {
//         switch (command) {
//             case 'get_window_label': return 'main';
//             case 'create_password_generate_page': return true;
//             case 'create_vault_window': return true;
//             case 'close_all_windows': return true;
//             case 'close_all_windows_except_vault_window': return true;
//             case 'close_all_windows_except_main_window': return true;
//             case 'close_current_window': return true;
//             case 'restart_app': return true;
//             default: throw new Error(`Unknown command: ${command}`);
//         }
//     });
// });
//
// // Инициализация тестового окружения Angular
// getTestBed().initTestEnvironment(
//     BrowserDynamicTestingModule,
//     platformBrowserDynamicTesting()
// );
//
// // Загрузка всех тестовых файлов
// const context = require.context('./', true, /\.spec\.ts$/);
// context.keys().map(context);
//
// describe('WindowService', () => {
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [WindowService]
//         });
//     });
//
//     it('should be created', () => {
//         const service = TestBed.inject(WindowService);
//         expect(service).toBeTruthy();
//     });
//
//     it('should get window label', async () => {
//         const label = await WindowService.getWindowLabel();
//         expect(label).toBe('main');
//         expect(invoke).toHaveBeenCalledWith('get_window_label');
//     });
//
//     it('should open password generate window', async () => {
//         spyOn(console, 'error'); // Подавляем логирование ошибок
//         await WindowService.openPasswordGenerateWindow();
//         expect(invoke).toHaveBeenCalledWith('create_password_generate_page');
//         expect(console.error).not.toHaveBeenCalled();
//     });
//
//     it('should handle error when opening password generate window', async () => {
//         mockIPC((command) => { if (command === 'create_password_generate_page') throw new Error('Failed'); });
//         spyOn(console, 'error');
//         await WindowService.openPasswordGenerateWindow();
//         expect(console.error).toHaveBeenCalledWith();
//     });
//
//     it('should open vault window', async () => {
//         spyOn(console, 'error'); // Подавляем логирование ошибок
//         await WindowService.openVaultWindow();
//         expect(invoke).toHaveBeenCalledWith('create_vault_window');
//         expect(console.error).not.toHaveBeenCalled();
//     });
//
//     it('should handle error when opening vault window', async () => {
//         mockIPC((command) => { if (command === 'create_vault_window') throw new Error('Failed'); });
//         spyOn(console, 'error');
//         await WindowService.openVaultWindow();
//         expect(console.error).toHaveBeenCalledWith();
//     });
//
//     it('should close all windows', async () => {
//         await WindowService.closeAllWindows();
//         expect(invoke).toHaveBeenCalledWith('close_all_windows');
//     });
//
//     it('should close all windows except vault', async () => {
//         await WindowService.closeAllWindowsExVault();
//         expect(invoke).toHaveBeenCalledWith('close_all_windows_except_vault_window');
//     });
//
//     it('should close all windows except main', async () => {
//         await WindowService.closeAllWindowsExMain();
//         expect(invoke).toHaveBeenCalledWith('close_all_windows_except_main_window');
//     });
//
//     it('should close current window', async () => {
//         await WindowService.closeCurrentWindow();
//         expect(invoke).toHaveBeenCalledWith('close_current_window');
//     });
//
//     it('should restart app', async () => {
//         spyOn(console, 'error');
//         await WindowService.restartApp();
//         expect(invoke).toHaveBeenCalledWith('restart_app');
//         expect(console.error).not.toHaveBeenCalled();
//     });
//
//     it('should handle error when restarting app', async () => {
//         mockIPC((command) => { if (command === 'restart_app') throw new Error('Restart failed'); });
//         spyOn(console, 'error');
//         await expectAsync(WindowService.restartApp()).toBeRejectedWithError('Restart failed');
//         expect(console.error).toHaveBeenCalledWith('Error restarting app:', jasmine.any(Error));
//     });
// });

import { fakeAsync, tick } from '@angular/core/testing';
import { mockIPC } from '@tauri-apps/api/mocks';
import { invoke } from '@tauri-apps/api/core';
import { WindowService } from '../../services/window.service';

// Мокирование Tauri-команд
beforeAll(() => {
  mockIPC((command) => {
    switch (command) {
      case 'get_window_label':
        return 'main';
      case 'create_password_generate_page':
        return true;
      case 'create_vault_window':
        return true;
      case 'close_all_windows':
        return true;
      case 'close_all_windows_except_vault_window':
        return true;
      case 'close_all_windows_except_main_window':
        return true;
      case 'close_current_window':
        return true;
      case 'restart_app':
        return true;
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  });
});

describe('WindowService', () => {
  let invokeSpy: jasmine.Spy;

  beforeEach(() => {
    // Мокируем invoke как шпион Jasmine
    invokeSpy = spyOn({ invoke }, 'invoke').and.callThrough();
  });

  it('should get window label', fakeAsync(() => {
    WindowService.getWindowLabel().then((label) => {
      expect(label).toBe('main');
      expect(invokeSpy).toHaveBeenCalledWith('get_window_label');
    });
    tick();
  }));

  it('should open password generate window', fakeAsync(() => {
    const consoleErrorSpy = spyOn(console, 'error');
    WindowService.openPasswordGenerateWindow().then(() => {
      expect(invokeSpy).toHaveBeenCalledWith('create_password_generate_page');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
    tick();
  }));

  it('should handle error when opening password generate window', fakeAsync(() => {
    invokeSpy.and.callFake((command) => {
      if (command === 'create_password_generate_page') {
        return Promise.reject(new Error('Failed'));
      }
      return Promise.resolve(true);
    });
    const consoleErrorSpy = spyOn(console, 'error');
    WindowService.openPasswordGenerateWindow().then(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    tick();
  }));

  it('should open vault window', fakeAsync(() => {
    const consoleErrorSpy = spyOn(console, 'error');
    WindowService.openVaultWindow().then(() => {
      expect(invokeSpy).toHaveBeenCalledWith('create_vault_window');
      expect(consoleErrorSpy).not.toHaveBeenCalled();    });
    tick();
  }));

  it('should handle error when opening vault window', fakeAsync(() => {
    invokeSpy.and.callFake((command) => {
      if (command === 'create_vault_window') {
        return Promise.reject(new Error('Failed'));
      }
      return Promise.resolve(true);
    });
    const consoleErrorSpy = spyOn(console, 'error');
    WindowService.openVaultWindow().then(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    tick();
  }));

  it('should close all windows', fakeAsync(() => {
    WindowService.closeAllWindows().then(() => {
      expect(invokeSpy).toHaveBeenCalledWith('close_all_windows');
    });
    tick();
  }));

  it('should close all windows except vault', fakeAsync(() => {
    WindowService.closeAllWindowsExVault().then(() => {
      expect(invokeSpy).toHaveBeenCalledWith('close_all_windows_except_vault_window');
    });
    tick();
  }));

  it('should close all windows except main', fakeAsync(() => {
    WindowService.closeAllWindowsExMain().then(() => {
      expect(invokeSpy).toHaveBeenCalledWith('close_all_windows_except_main_window');
    });
    tick();
  }));

  it('should close current window', fakeAsync(() => {
    WindowService.closeCurrentWindow().then(() => {
      expect(invokeSpy).toHaveBeenCalledWith('close_current_window');
    });
    tick();
  }));

  it('should restart app', fakeAsync(() => {
    const consoleErrorSpy = spyOn(console, 'error');
    WindowService.restartApp().then(() => {
      expect(invokeSpy).toHaveBeenCalledWith('restart_app');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
    tick();
  }));

  it('should handle error when restarting app', fakeAsync(() => {
    invokeSpy.and.callFake((command) => {
      if (command === 'restart_app') {
        return Promise.reject(new Error('Restart failed'));
      }
      return Promise.resolve(true);
    });
    const consoleErrorSpy = spyOn(console, 'error');
    WindowService.restartApp().catch((error) => {
      expect(error.message).toBe('Restart failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error restarting app:', error);
    });
    tick();
  }));
});