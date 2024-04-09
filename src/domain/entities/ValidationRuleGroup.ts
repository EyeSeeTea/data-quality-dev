import { Maybe } from "$/utils/ts-utils";
import { Id } from "./Ref";

export type ValidationRuleGroup = {
    id: Id;
    name: string;
    description: Maybe<string>;
};
