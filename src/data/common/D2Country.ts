import { D2Api } from "../../types/d2-api";
import { FutureData, apiToFuture } from "../api-futures";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { Country } from "../../domain/entities/Country";

export class D2OrgUnit {
    constructor(private api: D2Api) {}

    getByIds(ids: Id[]): FutureData<Country[]> {
        return apiToFuture(
            this.api.models.organisationUnits
                .get({
                    fields: {
                        id: true,
                        displayName: true,
                        displayFormName: true,
                        displayShortName: true,
                    },
                    filter: { id: { in: ids } },
                })
                .map(d2Response => {
                    return d2Response.data.objects.map(d2OrgUnit => {
                        return {
                            id: d2OrgUnit.id,
                            name:
                                d2OrgUnit.displayShortName ||
                                d2OrgUnit.displayFormName ||
                                d2OrgUnit.displayName,
                        };
                    });
                })
        );
    }
}
