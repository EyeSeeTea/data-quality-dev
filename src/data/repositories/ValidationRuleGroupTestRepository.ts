import { ValidationRuleGroup } from "$/domain/entities/ValidationRuleGroup";
import { ValidationRuleRepository } from "$/domain/repositories/ValidationRuleGroupRepository";
import { Future } from "$/domain/entities/generic/Future";
import { FutureData } from "../api-futures";

export class ValidationRuleTestRepository implements ValidationRuleRepository {
    get(): FutureData<ValidationRuleGroup[]> {
        return Future.success([]);
    }
}
