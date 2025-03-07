export const AppConstConfig = {
    APP_NAME: 'DurmanPass',
    APP_VERSION: '1.0.0',
    EXPORT: {
        DEFAULT_EXPORT_FILENAMES:{
            PASSWORD: '-passwords'
        },
        TEMPLATE_PATHS: {
            PASSWORDS_HTML: 'shared/export-templates/passwords/passwords-template.html',
        },
    },
    UI: {
        WINDOW_TITLE: 'DurmanPass - Управление паролями',
        EXPORT_SUCCESS_MESSAGE: 'Файл успешно сохранён по пути:',
    },
    IDENTIFIERS: {
        APP_ID: 'com.durmanpass.app',
    },
};