import { ValidationRuleGroup } from "$/domain/entities/ValidationRuleGroup";
import { ValidationRuleRepository } from "$/domain/repositories/ValidationRuleGroupRepository";
import { Future } from "$/domain/entities/generic/Future";
import { FutureData } from "../api-futures";

export class ValidationRuleTestRepository implements ValidationRuleRepository {
    getById(id: string): FutureData<ValidationRuleGroup> {
        throw new Error("Method not implemented.");
    }
    get(): FutureData<ValidationRuleGroup[]> {
        return Future.success([]);
    }
}
