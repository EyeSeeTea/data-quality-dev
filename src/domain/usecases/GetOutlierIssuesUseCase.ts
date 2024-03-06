import { FutureData } from "$/data/api-futures";
import { RowsPaginated } from "../entities/Pagination";
import { QualityAnalysisIssue } from "../entities/QualityAnalysisIssue";
import { GetIssuesOptions, IssueRepository } from "$/domain/repositories/IssueRepository";
import { Future } from "$/domain/entities/generic/Future";

export class GetOutlierIssuesUseCase {
    constructor(private issueRepository: IssueRepository) {}

    execute(options: GetIssuesOptions): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        if (!options.filters.sectionId) {
            return Future.success({
                pagination: {
                    page: 1,
                    pageCount: 1,
                    pageSize: 10,
                    total: 0,
                },
                rows: [],
            });
        }
        return this.issueRepository.get(options);
    }
}
