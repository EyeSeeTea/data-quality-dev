import { Id, Period } from "./Ref";

export type ValidationRuleAnalysis = {
    id: Id;
    countryId: Id;
    period: Period;
    categoryOptionId: Id;
    leftValue: number;
    rightValue: number;
    operator: string;
};
