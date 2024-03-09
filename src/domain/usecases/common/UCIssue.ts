import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { Future } from "$/domain/entities/generic/Future";
import { IssueRepository } from "$/domain/repositories/IssueRepository";
import { Id, Period } from "$/domain/entities/Ref";
import { getUid } from "$/utils/uid";
import { IssueStatus } from "$/domain/entities/IssueStatus";
import _ from "$/domain/entities/generic/Collection";
import { FutureData } from "$/data/api-futures";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { getCurrentSection } from "./utils";

export class UCIssue {
    constructor(private issueRepository: IssueRepository) {}

    save(issues: QualityAnalysisIssue[], qualityAnalysisId: Id): FutureData<void> {
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
        } = values;
        return new QualityAnalysisIssue({
            id: getUid(`issue-event_${sectionId}_${new Date().getTime()}`),
            number: issueNumber,
            azureUrl: "",
            period: period,
            country: { id: countryId, name: "", path: "" },
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
        });
    }

    generateIssueNumber(currentNumber: number, prefix: string): string {
        const correlative = currentNumber < 10 ? `0${currentNumber}` : currentNumber;
        const issueNumber = `${prefix}-I${correlative}`;
        return issueNumber;
    }

    getTotalIssuesBySection(analysis: QualityAnalysis, sectionName: string): FutureData<number> {
        const section = getCurrentSection(analysis, sectionName);
        return this.issueRepository
            .get({
                filters: {
                    endDate: undefined,
                    analysisIds: [analysis.id],
                    name: undefined,
                    sectionId: section?.id,
                    startDate: undefined,
                    status: undefined,
                    id: undefined,
                },
                pagination: { page: 1, pageSize: 10 },
                sorting: { field: "number", order: "asc" },
            })
            .map(response => {
                return response.pagination.total;
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
};
