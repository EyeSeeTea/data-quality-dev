import { ValidationRuleAnalysis } from "$/domain/entities/ValidationRuleAnalysis";
import { Future } from "$/domain/entities/generic/Future";
import { ValidationRuleAnalysisRepository } from "$/domain/repositories/ValidationRuleAnalysisRepository";
import { FutureData } from "../api-futures";

export class ValidationRuleAnalysisTestRepository implements ValidationRuleAnalysisRepository {
    get(): FutureData<ValidationRuleAnalysis[]> {
        return Future.success([]);
    }
}
