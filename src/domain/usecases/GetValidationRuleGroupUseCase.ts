import { FutureData } from "$/data/api-futures";
import { ValidationRuleGroup } from "../entities/ValidationRuleGroup";
import { ValidationRuleRepository } from "../repositories/ValidationRuleGroupRepository";

export class GetValidationRuleGroupUseCase {
    constructor(private validationRuleRepository: ValidationRuleRepository) {}

    execute(): FutureData<ValidationRuleGroup[]> {
        return this.validationRuleRepository.get();
    }
}
