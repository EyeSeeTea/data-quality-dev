import { RowsPaginated } from "$/domain/entities/Pagination";
import { Id } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";
import { FutureData } from "../../data/api-futures";
import { QualityAnalysisIssue } from "../entities/QualityAnalysisIssue";
import { Pagination } from "$/domain/entities/Pagination";

export interface IssueRepository {
    get(options: GetIssuesOptions): FutureData<RowsPaginated<QualityAnalysisIssue>>;
    create(issues: QualityAnalysisIssue[], qualityAnalysisId: Id): FutureData<void>;
}

export type GetIssuesOptions = {
    pagination: Pick<Pagination, "page" | "pageSize">;
    sorting: { field: string; order: "asc" | "desc" };
    filters: {
        endDate: Maybe<string>;
        name: Maybe<string>;
        startDate: Maybe<string>;
        status: Maybe<string>;
        ids: Maybe<Id[]>;
        sectionId: Maybe<Id>;
    };
};
