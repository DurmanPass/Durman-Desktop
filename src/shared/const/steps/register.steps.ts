import {Step} from "../../../interfaces/components/steps/login-steps.interface";

export const RegisterStepsId = {
    EmailStepId: "EmailStepId",
    ConfirmEmailStepId: "ConfirmEmailStepId",
    PasswordStepId: "PasswordStepId",
    HintPasswordStepId: "HintPasswordStepId",
    TwoFactorStepId: "TwoFactorStepId"
}

export const RegisterSteps = (sendEmail: () => void, verifyCode: () => void, sendPassword: () => void):Step[] => [
    {
        id: "step_1",
        skip: false,
        contentId: RegisterStepsId.EmailStepId,
        action: () => sendEmail()
    },
    {
        id: "step_2",
        skip: false,
        contentId: RegisterStepsId.ConfirmEmailStepId,
        action: () => verifyCode()
    },
    {
        id: "step_3",
        skip: false,
        contentId: RegisterStepsId.PasswordStepId,
        action: () => console.log('step_3')
    },
    {
        id: "step_4",
        skip: false,
        contentId: RegisterStepsId.HintPasswordStepId,
        action: () => sendPassword()
    },
];
