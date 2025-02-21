import {Step} from "../../../interfaces/components/steps/login-steps.interface";

export const LoginStepsId = {
    EmailStepId: "EmailStepId",
    ConfirmEmailStepId: "ConfirmEmailStepId",
    PasswordStepId: "PasswordStepId",
    HintPasswordStepId: "HintPasswordStepId",
    TwoFactorStepId: "TwoFactorStepId"
}

export const LoginSteps: Step[] = [
    {
        id: "One",
        skip: false,
        contentId: LoginStepsId.EmailStepId
    },
    {
        id: "Two",
        skip: false,
        contentId: LoginStepsId.ConfirmEmailStepId
    },
    {
        id: "Three",
        skip: false,
        contentId: LoginStepsId.PasswordStepId
    },
    {
        id: "Four",
        skip: false,
        contentId: LoginStepsId.HintPasswordStepId
    },
    {
        id: "Five",
        skip: true,
        contentId: LoginStepsId.TwoFactorStepId
    },
];