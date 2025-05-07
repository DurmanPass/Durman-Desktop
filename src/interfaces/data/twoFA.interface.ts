export interface Enable2FAResponse {
    message: string;
    uuid: string;
}

export interface Confirm2FAPayload {
    uuid: string;
    code: string;
}

export interface Confirm2FAResponse {
    message: string;
}

export interface Disable2FAResponse {
    message: string;
    uuid: string;
}

export interface Verify2FAPayload {
    userID: string;
    code: string;
}

export interface Verify2FAResponse {
    accessToken: string;
    message: string;
    refreshToken: string;
}