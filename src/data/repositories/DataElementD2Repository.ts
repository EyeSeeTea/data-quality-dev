import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { DataElement } from "../../domain/entities/DataElement";
import { DataElementRepository } from "../../domain/repositories/DataElementRepository";
import { D2DataElement } from "../common/D2DataElement";

export class DataElementD2Repository implements DataElementRepository {
    d2DataElement: D2DataElement;

    constructor(private api: D2Api) {
        this.d2DataElement = new D2DataElement(this.api);
    }

    getByIds(ids: Id[]): FutureData<DataElement[]> {
        return this.d2DataElement.getByIds(ids);
    }
}
