import { RowsPaginated } from "$/domain/entities/Pagination";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { IssueRepository } from "$/domain/repositories/IssueRepository";
import { FutureData } from "../api-futures";

export class IssueTestRepository implements IssueRepository {
    get(): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        throw new Error("Method not implemented.");
    }
    save(): FutureData<void> {
        throw new Error("Method not implemented.");
    }
}
