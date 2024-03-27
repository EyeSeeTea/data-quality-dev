import { FutureData } from "$/data/api-futures";
import { Id } from "../entities/Ref";
import { ValidationRuleGroup } from "../entities/ValidationRuleGroup";

export interface ValidationRuleGroupRepository {
    get(): FutureData<ValidationRuleGroup[]>;
    getById(id: Id): FutureData<ValidationRuleGroup>;
}
