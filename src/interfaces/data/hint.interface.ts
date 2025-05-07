export interface RequestHintPayload {
    email: string;
}

export interface RequestHintResponse {
    message: string;
    uuid: string;
}

export interface GetHintPayload {
    uuid: string;
    code: string;
}

export interface GetHintResponse {
    password_hint: string;
}