import { FutureData } from "../../data/api-futures";
import { DataElement } from "../entities/DataElement";
import { Id } from "../entities/Ref";

export interface DataElementRepository {
    getByIds(ids: Id[]): FutureData<DataElement[]>;
}
