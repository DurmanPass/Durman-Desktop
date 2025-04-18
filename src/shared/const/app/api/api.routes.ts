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
    },
    CATEGORY: {
        CREATE_CATEGORY: ApiSettings.apiUrl + '/categories',
        GET_ALL_CATEGORY_USER: ApiSettings.apiUrl + '/categories',
        GET_CATEGORY_BY_ID: (categoryId: string) => ApiSettings.apiUrl + `/categories/${categoryId}`,
        UPDATE_CATEGORY: (categoryId: string) => ApiSettings.apiUrl + `/categories/${categoryId}`,
        DELETE_CATEGORY: (categoryId: string) => ApiSettings.apiUrl + `/categories/${categoryId}`,
    },
    PASSWORD: {
        GENERATE_IV: ApiSettings.apiUrl + '/passwords/generate-iv',
        CREATE_PASSWORD: ApiSettings.apiUrl + '/passwords',
        GET_ALL_PASSWORDS: ApiSettings.apiUrl + '/passwords',
        GET_PASSWORD_BY_ID: (id: string) => ApiSettings.apiUrl + `/passwords/${id}`,
        UPDATE_PASSWORD: (id: string) => ApiSettings.apiUrl + `/passwords/${id}`,
        DELETE_PASSWORD: (id: string) => ApiSettings.apiUrl + `/passwords/${id}`,
    }
};