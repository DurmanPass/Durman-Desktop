export interface StepValidation {
    [key: string]: { [key: string]: boolean | StepValidation };
}
