import { DataElement } from "./DataElement";
import { NamedRef } from "./Ref";

export type Module = NamedRef & {
    dataElements: DataElement[];
    disaggregations: NamedRef[];
};
