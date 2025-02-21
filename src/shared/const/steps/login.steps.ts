import {Step} from "../../../interfaces/components/steps/login-steps.interface";

export const LoginStepsId = {
    EmailStepId: "EmailStepId",
    PasswordStepId: "PasswordStepId"
}

export const LoginSteps: Step[] = [
    {
        id: "loginEmailStepOne",
        skip: false,
        contentId: LoginStepsId.EmailStepId
    },
    {
        id: "loginEmailStepTwo",
        skip: false,
        contentId: LoginStepsId.PasswordStepId
    },
];