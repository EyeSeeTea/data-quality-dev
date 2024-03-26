import { FutureData } from "$/data/api-futures";
import { DateISOString, Id } from "../entities/Ref";
import { ValidationRuleAnalysis } from "../entities/ValidationRuleAnalysis";

export interface ValidationRuleAnalysisRepository {
    get(options: ValidationRuleOptions): FutureData<ValidationRuleAnalysis[]>;
}

export type ValidationRuleOptions = {
    countryId: Id;
    startDate: DateISOString;
    endDate: DateISOString;
    vrg: Id;
};
