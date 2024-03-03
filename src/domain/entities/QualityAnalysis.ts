import { Either } from "./generic/Either";
import { ValidationError } from "./generic/Errors";
import { Struct } from "./generic/Struct";
import { validateRequired } from "./generic/validations";
import { Module } from "./Module";
import { QualityAnalysisSection } from "./QualityAnalysisSection";
import { QualityAnalysisStatus } from "./QualityAnalysisStatus";
import { Id } from "./Ref";

export interface QualityAnalysisAttrs {
    id: Id;
    endDate: string;
    module: Module;
    name: string;
    startDate: string;
    status: QualityAnalysisStatus;
    sections: QualityAnalysisSection[];
    lastModification: string;
    countriesAnalysis: Id[];
}

export class QualityAnalysis extends Struct<QualityAnalysisAttrs>() {
    static build(
        attrs: QualityAnalysisAttrs
    ): Either<ValidationError<QualityAnalysis>[], QualityAnalysis> {
        const qualityAnalysis = new QualityAnalysis({
            ...attrs,
            name: attrs.name,
        });

        const errors: ValidationError<QualityAnalysis>[] = [
            {
                property: "name" as const,
                errors: validateRequired(qualityAnalysis.name),
                value: qualityAnalysis.name,
            },
            {
                property: "module" as const,
                errors: validateRequired(qualityAnalysis.module.id),
                value: qualityAnalysis.module.id,
            },
            {
                property: "startDate" as const,
                errors: validateRequired(qualityAnalysis.startDate),
                value: qualityAnalysis.startDate,
            },
            {
                property: "endDate" as const,
                errors: validateRequired(qualityAnalysis.endDate),
                value: qualityAnalysis.endDate,
            },
            {
                property: "status" as const,
                errors: validateRequired(qualityAnalysis.status),
                value: qualityAnalysis.status,
            },
        ].filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.success(qualityAnalysis);
        } else {
            return Either.error(errors);
        }
    }

    static buildDefaultName(name: string, prefix: string): string {
        if (!prefix) throw Error("Prefix is required");
        if (name) return name;
        const date = new Date();
        const formattedDate = date.toISOString().replace(/[-:T.]/g, "_");
        return `${prefix} - ${formattedDate}`;
    }
}
