import { D2Api } from "../../types/d2-api";
import { FutureData, apiToFuture } from "../api-futures";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { CategoryOption } from "../../domain/entities/CategoryOption";

export class D2CategoryOption {
    constructor(private api: D2Api) {}

    getByIds(ids: Id[]): FutureData<CategoryOption[]> {
        return apiToFuture(
            this.api.models.categoryOptionCombos
                .get({
                    fields: {
                        id: true,
                        displayFormName: true,
                        displayName: true,
                        displayShortName: true,
                    },
                    filter: { id: { in: ids } },
                })
                .map(d2Response => {
                    return d2Response.data.objects.map(d2CategoryOption => {
                        return {
                            id: d2CategoryOption.id,
                            name:
                                d2CategoryOption.displayShortName ||
                                d2CategoryOption.displayFormName ||
                                d2CategoryOption.displayName,
                        };
                    });
                })
        );
    }
}
