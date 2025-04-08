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
        contentId: LoginStepsId.EmailStepId,
        action: () => console.log('step_1')
    },
    {
        id: "Two",
        skip: false,
        contentId: LoginStepsId.ConfirmEmailStepId,
        action: () => console.log('step_2')
    },
    {
        id: "Three",
        skip: false,
        contentId: LoginStepsId.PasswordStepId,
        action: () => console.log('step_3')
    },
    {
        id: "Four",
        skip: false,
        contentId: LoginStepsId.HintPasswordStepId,
        action: () => console.log('step_4')
    },
    {
        id: "Five",
        skip: true,
        contentId: LoginStepsId.TwoFactorStepId,
        action: () => console.log('step_5')
    },
];