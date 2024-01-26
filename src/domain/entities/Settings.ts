import { Either } from "./generic/Either";
import { ValidationError } from "./generic/Errors";
import { Struct } from "./generic/Struct";
import { validateRequired } from "./generic/validations";
import { Module } from "./Module";

export interface SettingsAttrs {
    endDate: string;
    module: Module;
    startDate: string;
    orgUnitLevel: number;
}

export class Settings extends Struct<SettingsAttrs>() {
    static build(attrs: SettingsAttrs): Either<ValidationError<Settings>[], Settings> {
        const settings = new Settings(attrs);

        const errors: ValidationError<Settings>[] = [
            {
                property: "endDate" as const,
                errors: validateRequired(settings.endDate),
                value: settings.endDate,
            },
            {
                property: "module" as const,
                errors: validateRequired(settings.module.id),
                value: settings.module.id,
            },
            {
                property: "startDate" as const,
                errors: validateRequired(settings.startDate),
                value: settings.startDate,
            },
            {
                property: "orgUnitLevel" as const,
                errors: validateRequired(settings.orgUnitLevel),
                value: settings.orgUnitLevel,
            },
        ].filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.success(settings);
        } else {
            return Either.error(errors);
        }
    }
}
