import { Maybe } from "../../utils/ts-utils";
import { Country } from "./Country";
import { Struct } from "./generic/Struct";
import { IssueAction } from "./IssueAction";
import { IssueStatus } from "./IssueStatus";
import { Id, IssueNumber, IssuePeriod, NamedRef } from "./Ref";

export interface QualityAnalysisIssueAttrs {
    id: Id;
    number: IssueNumber;
    azureUrl: string;
    period: IssuePeriod;
    country: Maybe<Country>;
    dataElement: Maybe<NamedRef>;
    categoryOption: Maybe<NamedRef>;
    description: string;
    followUp: boolean;
    status: Maybe<IssueStatus>;
    action: Maybe<IssueAction>;
    actionDescription: string;
    type: string;
}

export class QualityAnalysisIssue extends Struct<QualityAnalysisIssueAttrs>() {}
