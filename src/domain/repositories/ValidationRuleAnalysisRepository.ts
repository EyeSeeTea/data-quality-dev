import { FutureData } from "$/data/api-futures";
import { ValidationRuleAnalysis } from "../entities/ValidationRuleAnalysis";

export interface ValidationRuleAnalysisRepository {
    get(): FutureData<ValidationRuleAnalysis[]>;
}
