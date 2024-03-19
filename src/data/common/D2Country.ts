import { D2Api } from "$/types/d2-api";
import { FutureData, apiToFuture } from "../api-futures";
import { Id } from "$/domain/entities/Ref";
import _ from "$/domain/entities/generic/Collection";
import { Country } from "$/domain/entities/Country";
import { Future } from "$/domain/entities/generic/Future";

export class D2OrgUnit {
    constructor(private api: D2Api) {}

    getByIds(ids: Id[]): FutureData<Country[]> {
        const $requests = Future.sequential(
            _(ids)
                .chunk(50)
                .map(countriesIds => {
                    return apiToFuture(
                        this.api.models.organisationUnits.get({
                            fields: {
                                id: true,
                                displayName: true,
                                displayFormName: true,
                                displayShortName: true,
                                path: true,
                            },
                            filter: { id: { in: countriesIds } },
                        })
                    ).map(d2Response => {
                        return d2Response.objects.map((d2OrgUnit): Country => {
                            return {
                                id: d2OrgUnit.id,
                                name:
                                    d2OrgUnit.displayShortName ||
                                    d2OrgUnit.displayFormName ||
                                    d2OrgUnit.displayName,
                                path: d2OrgUnit.path,
                                writeAccess: false,
                            };
                        });
                    });
                })
                .value()
        );

        return Future.sequential([$requests]).flatMap(countries => {
            const first = _(countries).first();
            if (!first) return Future.success([]);
            const allCountries = _(first).flatten().value();
            return Future.success(allCountries);
        });
    }
}
