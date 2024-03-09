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
                        valueType: true,
                        categoryCombo: { id: true, displayName: true, categoryOptionCombos: true },
                    },
                    filter: { id: { in: ids } },
                })
                .map(d2Response => {
                    return d2Response.data.objects.map((d2DataElement): DataElement => {
                        return {
                            id: d2DataElement.id,
                            name:
                                d2DataElement.displayFormName ||
                                d2DataElement.displayShortName ||
                                d2DataElement.displayName,
                            isNumber:
                                d2DataElement.valueType === "NUMBER" ||
                                d2DataElement.valueType.includes("INTEGER"),
                            disaggregation: d2DataElement.categoryCombo
                                ? {
                                      id: d2DataElement.categoryCombo.id,
                                      name: d2DataElement.categoryCombo.displayName,
                                      options: d2DataElement.categoryCombo.categoryOptionCombos.map(
                                          coc => coc.id
                                      ),
                                  }
                                : undefined,
                        };
                    });
                })
        );
    }
}
