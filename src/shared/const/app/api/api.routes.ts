import {ApiSettings} from "./api.settings";

export const ApiRoutes = {
    REGISTER: {
        SEND_EMAIL: ApiSettings.apiUrl + '/register/email',
        VERIFY_CODE: ApiSettings.apiUrl + '/register/verify-code',
        SET_PASSWORD: ApiSettings.apiUrl + '/register/set-password'
    },
    LOGIN: {
        LOGIN: ApiSettings.apiUrl + '/login'
    },
    REFRESH_TOKEN: {
        REFRESH: ApiSettings.apiUrl + '/refresh-token'
    }
};