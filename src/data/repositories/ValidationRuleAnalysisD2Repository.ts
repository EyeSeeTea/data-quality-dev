import { ValidationRuleAnalysis } from "$/domain/entities/ValidationRuleAnalysis";
import { D2Api } from "$/types/d2-api";
import { Id } from "$/domain/entities/Ref";
import { FutureData, apiToFuture } from "../api-futures";
import {
    ValidationRuleAnalysisRepository,
    ValidationRuleOptions,
} from "$/domain/repositories/ValidationRuleAnalysisRepository";

export class ValidationRuleAnalysisD2Repository implements ValidationRuleAnalysisRepository {
    constructor(private api: D2Api) {}

    get(options: ValidationRuleOptions): FutureData<ValidationRuleAnalysis[]> {
        return apiToFuture(
            this.api.request<D2ValidationRule[]>({
                method: "post",
                url: "/dataAnalysis/validationRules",
                data: {
                    notification: false,
                    persist: false,
                    ou: options.countryId,
                    startDate: options.startDate,
                    endDate: options.endDate,
                    vrg: options.validationRuleGroupId,
                },
            })
        ).map(response => {
            return response.map(element => {
                const rule: ValidationRuleAnalysis = {
                    id: element.validationRuleId,
                    countryId: element.organisationUnitId,
                    period: element.periodId,
                    categoryOptionId: element.attributeOptionComboId,
                    leftValue: element.leftSideValue,
                    operator: element.operator,
                    rightValue: element.rightSideValue,
                };
                return rule;
            });
        });
    }
}

type D2ValidationRule = {
    validationRuleId: Id;
    organisationUnitId: Id;
    periodId: Id;
    attributeOptionComboId: Id;
    leftSideValue: number;
    operator: string;
    rightSideValue: number;
};
