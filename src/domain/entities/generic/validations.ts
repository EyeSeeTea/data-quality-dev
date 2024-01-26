import { ValidationErrorKey } from "./Errors";

export function validateRequired(value: any): ValidationErrorKey[] {
    const isBlank = !value || (value.length !== undefined && value.length === 0);

    return isBlank ? ["field_cannot_be_blank"] : [];
}
