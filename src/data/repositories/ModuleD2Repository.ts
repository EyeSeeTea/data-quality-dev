import { D2Api } from "$/types/d2-api";

import { MetadataItem } from "$/domain/entities/MetadataItem";
import { Module } from "$/domain/entities/Module";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";
import { FutureData, apiToFuture } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";
import { getDefaultModules } from "../common/D2Module";
import { DataElement } from "$/domain/entities/DataElement";
import _ from "$/domain/entities/generic/Collection";
import { Maybe } from "$/utils/ts-utils";

export class ModuleD2Repository implements ModuleRepository {
    constructor(private api: D2Api, private metadata: MetadataItem) {}

    getByIds(ids: string[]): FutureData<Module[]> {
        return apiToFuture(
            this.api.models.dataSets.get({
                fields: {
                    id: true,
                    displayName: true,
                    code: true,
                    sections: {
                        id: true,
                        dataElements: { id: true },
                    },
                    dataSetElements: {
                        dataElement: {
                            id: true,
                            displayFormName: true,
                            valueType: true,
                            categoryCombo: {
                                id: true,
                                displayName: true,
                                categoryOptionCombos: true,
                            },
                        },
                        categoryCombo: { id: true, displayName: true, categoryOptionCombos: true },
                    },
                },
                filter: { id: { in: ids } },
            })
        ).map(d2Response => {
            return d2Response.objects.map((d2DataSet): Module => {
                const sectionDataElements = d2DataSet.sections
                    .flatMap(section => section.dataElements)
                    .map(dataElement => dataElement.id);

                return {
                    id: d2DataSet.id,
                    name: d2DataSet.displayName,
                    dataElements: _(d2DataSet.dataSetElements)
                        .map((d2DataSetElement): Maybe<DataElement> => {
                            if (!sectionDataElements.includes(d2DataSetElement.dataElement.id))
                                return undefined;
                            const d2CategoryCombo =
                                d2DataSetElement.categoryCombo ||
                                d2DataSetElement.dataElement.categoryCombo;
                            return {
                                id: d2DataSetElement.dataElement.id,
                                name: d2DataSetElement.dataElement.displayFormName,
                                isNumber:
                                    d2DataSetElement.dataElement.valueType === "NUMBER" ||
                                    d2DataSetElement.dataElement.valueType.includes("INTEGER"),
                                disaggregation: d2CategoryCombo
                                    ? {
                                          id: d2CategoryCombo.id,
                                          name: d2CategoryCombo.displayName,
                                          options: d2CategoryCombo.categoryOptionCombos.map(
                                              coc => coc.id
                                          ),
                                      }
                                    : undefined,
                            };
                        })
                        .compact()
                        .value(),
                    disaggregations: [],
                };
            });
        });
    }

    get(): FutureData<Module[]> {
        return Future.success(getDefaultModules(this.metadata));
    }
}
