import { FutureData } from "$/data/api-futures";
import { ValidationRuleGroup } from "../entities/ValidationRuleGroup";

export interface ValidationRuleRepository {
    get(): FutureData<ValidationRuleGroup[]>;
}
