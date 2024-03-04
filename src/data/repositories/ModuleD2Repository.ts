import { D2Api } from "$/types/d2-api";

import { MetadataItem } from "$/domain/entities/MetadataItem";
import { Module } from "$/domain/entities/Module";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";
import { FutureData, apiToFuture } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import { getDefaultModules } from "../common/D2Module";

export class ModuleD2Repository implements ModuleRepository {
    constructor(private api: D2Api, private metadata: MetadataItem) {}

    getByIds(ids: string[]): FutureData<Module[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: {
                    id: true,
                    displayName: true,
                    code: true,
                    dataSetElements: {
                        dataElement: { id: true, displayName: true, valueType: true },
                    },
                },
                filter: { id: { in: ids } },
            })
        ).map(d2Response => {
            return d2Response.objects.map((d2DataSet): Module => {
                return {
                    id: d2DataSet.id,
                    name: d2DataSet.displayName,
                    dataElements: d2DataSet.dataSetElements.map(d2DataSetElement => {
                        return {
                            id: d2DataSetElement.dataElement.id,
                            name: d2DataSetElement.dataElement.displayName,
                            isNumber:
                                d2DataSetElement.dataElement.valueType === "NUMBER" ||
                                d2DataSetElement.dataElement.valueType.includes("INTEGER"),
                        };
                    }),
                };
            });
        });
    }

    get(): FutureData<Module[]> {
        return Future.success(getDefaultModules(this.metadata));
    }
}
