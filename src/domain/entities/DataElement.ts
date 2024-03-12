import { Maybe } from "$/utils/ts-utils";
import { Id, NamedRef } from "./Ref";

export type DataElement = NamedRef & {
    isNumber: boolean;
    disaggregation: Maybe<NamedRef & { options: Id[] }>;
};
