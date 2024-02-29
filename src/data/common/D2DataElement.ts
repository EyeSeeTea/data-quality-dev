import { D2Api } from "../../types/d2-api";
import { FutureData, apiToFuture } from "../api-futures";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { DataElement } from "../../domain/entities/DataElement";

export class D2DataElement {
    constructor(private api: D2Api) {}

    getByIds(ids: Id[]): FutureData<DataElement[]> {
        return apiToFuture(
            this.api.models.dataElements
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
                    return d2Response.data.objects.map(d2DataElement => {
                        return {
                            id: d2DataElement.id,
                            name:
                                d2DataElement.displayFormName ||
                                d2DataElement.displayShortName ||
                                d2DataElement.displayName,
                        };
                    });
                })
        );
    }
}
