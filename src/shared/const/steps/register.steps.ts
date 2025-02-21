import {Step} from "../../../interfaces/components/steps/login-steps.interface";

export const RegisterStepsId = {
    EmailStepId: "EmailStepId",
    ConfirmEmailStepId: "ConfirmEmailStepId",
    PasswordStepId: "PasswordStepId",
    HintPasswordStepId: "HintPasswordStepId",
    TwoFactorStepId: "TwoFactorStepId"
}

export const RegisterSteps: Step[] = [
    {
        id: "One",
        skip: false,
        contentId: RegisterStepsId.EmailStepId
    },
    {
        id: "Two",
        skip: false,
        contentId: RegisterStepsId.ConfirmEmailStepId
    },
    {
        id: "Three",
        skip: false,
        contentId: RegisterStepsId.PasswordStepId
    },
    {
        id: "Four",
        skip: false,
        contentId: RegisterStepsId.HintPasswordStepId
    },
    {
        id: "Five",
        skip: true,
        contentId: RegisterStepsId.TwoFactorStepId
    },
];