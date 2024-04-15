import { FutureData } from "$/data/api-futures";
import { ValidationRuleGroup } from "../entities/ValidationRuleGroup";
import { ValidationRuleGroupRepository } from "../repositories/ValidationRuleGroupRepository";

export class GetValidationRuleGroupUseCase {
    constructor(private validationRuleGroupRepository: ValidationRuleGroupRepository) {}

    execute(): FutureData<ValidationRuleGroup[]> {
        return this.validationRuleGroupRepository.get();
    }
}
