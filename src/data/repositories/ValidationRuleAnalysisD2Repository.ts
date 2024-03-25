import { ValidationRuleAnalysis } from "$/domain/entities/ValidationRuleAnalysis";
import { D2Api } from "$/types/d2-api";
import { Id } from "$/domain/entities/Ref";
import { FutureData, apiToFuture } from "../api-futures";

export class ValidationRuleAnalysisD2Repository {
    constructor(private api: D2Api) {}

    get(): FutureData<ValidationRuleAnalysis[]> {
        return apiToFuture(
            this.api.request<D2ValidationRule[]>({
                method: "post",
                url: "/api/dataAnalysis/validationRules",
                data: {
                    endDate: "2022-12-31",
                    notification: false,
                    ou: "H8RixfF8ugH",
                    persist: false,
                    startDate: "2022-01-01",
                    vrg: "TvHK59Z3Taq",
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
