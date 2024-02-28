import { RowsPaginated } from "$/domain/entities/Pagination";
import { Id } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";
import { FutureData } from "../../data/api-futures";
import { QualityAnalysisIssue } from "../entities/QualityAnalysisIssue";

export interface IssueRepository {
    get(options: GetIssuesOptions): FutureData<RowsPaginated<QualityAnalysisIssue>>;
    save(issues: QualityAnalysisIssue[], qualityAnalysisId: Id): FutureData<void>;
}

export type GetIssuesOptions = { programStage: Maybe<Id>; ids: Maybe<Id[]> };
