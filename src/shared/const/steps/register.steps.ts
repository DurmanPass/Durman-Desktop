import {Step} from "../../../interfaces/components/steps/login-steps.interface";
import {StepValidation} from "../../../interfaces/components/steps/stepValidation.interface";

export const RegisterStepsId = {
    EmailStepId: "EmailStepId",
    ConfirmEmailStepId: "ConfirmEmailStepId",
    PasswordStepId: "PasswordStepId",
    HintPasswordStepId: "HintPasswordStepId",
    TwoFactorStepId: "TwoFactorStepId"
}

export const RegisterSteps: Step[] = [
    {
        id: "step_1",
        skip: false,
        contentId: RegisterStepsId.EmailStepId
    },
    {
        id: "step_2",
        skip: false,
        contentId: RegisterStepsId.ConfirmEmailStepId
    },
    {
        id: "step_3",
        skip: false,
        contentId: RegisterStepsId.PasswordStepId
    },
    {
        id: "step_4",
        skip: false,
        contentId: RegisterStepsId.HintPasswordStepId
    },
    // {
    //     id: "Five",
    //     skip: true,
    //     contentId: RegisterStepsId.TwoFactorStepId
    // },
];
