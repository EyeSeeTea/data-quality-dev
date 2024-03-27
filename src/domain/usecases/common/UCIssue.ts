import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { Future } from "$/domain/entities/generic/Future";
import { GetIssuesOptions, IssueRepository } from "$/domain/repositories/IssueRepository";
import { Id, Period } from "$/domain/entities/Ref";
import { getUid } from "$/utils/uid";
import { IssueStatus } from "$/domain/entities/IssueStatus";
import _ from "$/domain/entities/generic/Collection";
import { FutureData } from "$/data/api-futures";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { RowsPaginated } from "$/domain/entities/Pagination";

export class UCIssue {
    constructor(private issueRepository: IssueRepository) {}

    save(issues: QualityAnalysisIssue[], qualityAnalysisId: Id): FutureData<void> {
        if (issues.length === 0) return Future.success(undefined);
        const concurrencyRequest = 10;
        const $requests = Future.parallel(
            _(issues)
                .map(issue => this.issueRepository.create(issue, qualityAnalysisId))
                .value(),
            { concurrency: concurrencyRequest }
        );

        return $requests.flatMap(() => {
            return Future.success(undefined);
        });
    }

    buildDefaultIssue(values: DefaultIssue, sectionId: Id): QualityAnalysisIssue {
        const {
            categoryOptionComboId,
            countryId,
            dataElementId,
            issueNumber,
            period,
            description,
            correlative,
        } = values;
        return new QualityAnalysisIssue({
            id: getUid(`issue-event_${sectionId}_${new Date().getTime()}`),
            number: issueNumber,
            azureUrl: "",
            period: period,
            country: { id: countryId, name: "", path: "", writeAccess: false },
            dataElement: { id: dataElementId, name: "" },
            categoryOption: { id: categoryOptionComboId, name: "" },
            description: description,
            followUp: false,
            status: IssueStatus.create({
                id: "",
                code: "0",
                name: "",
            }),
            action: undefined,
            actionDescription: "",
            type: sectionId,
            comments: "",
            contactEmails: "",
            correlative: correlative,
        });
    }

    generateIssueNumber(currentNumber: number, prefix: string): string {
        const correlative = currentNumber < 10 ? `0${currentNumber}` : currentNumber;
        const issueNumber = `${prefix}-I${correlative}`;
        return issueNumber;
    }

    getTotalIssuesBySection(analysis: QualityAnalysis, sectionId: string): FutureData<number> {
        return this.issueRepository
            .get({
                filters: {
                    actions: undefined,
                    countries: [],
                    analysisIds: [analysis.id],
                    name: undefined,
                    sectionId: sectionId,
                    periods: [],
                    status: undefined,
                    id: undefined,
                    followUp: undefined,
                },
                pagination: { page: 1, pageSize: 10 },
                sorting: { field: "number", order: "asc" },
            })
            .map(response => {
                return response.pagination.total;
            });
    }

    getAllIssues(
        filters: GetIssuesOptions["filters"],
        state: { initialPage: number; issues: QualityAnalysisIssue[] }
    ): FutureData<QualityAnalysisIssue[]> {
        const { initialPage, issues } = state;
        return this.getIssues(filters, initialPage).flatMap(response => {
            const newIssues = [...issues, ...response.rows];
            if (response.pagination.page >= response.pagination.pageCount) {
                return Future.success(newIssues);
            } else {
                return this.getAllIssues(filters, {
                    initialPage: initialPage + 1,
                    issues: newIssues,
                });
            }
        });
    }

    private getIssues(
        filters: GetIssuesOptions["filters"],
        page: number
    ): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        return this.issueRepository.get({
            filters: filters,
            pagination: { page: page, pageSize: 100 },
            sorting: { field: "number", order: "asc" },
        });
    }
}

type DefaultIssue = {
    categoryOptionComboId: Id;
    countryId: Id;
    dataElementId: Id;
    description: string;
    issueNumber: string;
    period: Period;
    correlative: string;
};
