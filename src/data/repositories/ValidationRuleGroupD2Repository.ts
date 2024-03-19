import { ValidationRuleGroup } from "$/domain/entities/ValidationRuleGroup";
import { D2Api } from "$/types/d2-api";
import { FutureData, apiToFuture } from "../api-futures";

export class ValidationRuleD2Repository {
    constructor(private api: D2Api) {}

    get(): FutureData<ValidationRuleGroup[]> {
        return apiToFuture(
            this.api.models.validationRuleGroups
                .get({
                    fields: {
                        id: true,
                        name: true,
                    },
                    filter: { id: {} },
                })
                .map(d2Response => {
                    return d2Response.data.objects.map(ValidationRuleGroupD2Repository => {
                        return {
                            id: ValidationRuleGroupD2Repository.id,
                            name: ValidationRuleGroupD2Repository.name,
                        };
                    });
                })
        );
    }
}
