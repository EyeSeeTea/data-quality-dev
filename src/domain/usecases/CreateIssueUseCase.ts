import { FutureData } from "$/data/api-futures";
import { IssueRepository } from "$/domain/repositories/IssueRepository";
import { UCIssue } from "$/domain/usecases/common/UCIssue";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { Id, Period } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import { UCAnalysis } from "$/domain/usecases/common/UCAnalysis";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { Maybe } from "$/utils/ts-utils";

export type IssueTemplate = {
    categoryOptionComboId: Maybe<Id>;
    countryId: Maybe<Id>;
    dataElementId: Maybe<Id>;
    description: string;
    period: Maybe<Period>;
};

export class CreateIssueUseCase {
    private issueUseCase: UCIssue;
    private analysisUseCase: UCAnalysis;

    constructor(
        private analysisRepository: QualityAnalysisRepository,
        private issueRepository: IssueRepository
    ) {
        this.issueUseCase = new UCIssue(this.issueRepository);
        this.analysisUseCase = new UCAnalysis(this.analysisRepository);
    }

    execute(options: CreateIssueUseCaseOptions): FutureData<void> {
        const { qualityAnalysisId, sectionId, issues } = options;

        return this.fetchAnalysisAndTotalIssues(qualityAnalysisId, sectionId)
            .map(analysisAndTotalIssues =>
                this.buildIssues({ issues, sectionId, ...analysisAndTotalIssues })
            )
            .flatMap(issuesToCreate => this.issueUseCase.save(issuesToCreate, qualityAnalysisId))
            .flatMap(() => Future.success(undefined));
    }

    private fetchAnalysisAndTotalIssues(
        qualityAnalysisId: Id,
        sectionId: Id
    ): FutureData<AnalysisAndTotalIssues> {
        return this.analysisUseCase
            .getById(qualityAnalysisId)
            .flatMap(analysis =>
                this.issueUseCase
                    .getTotalIssuesBySection(analysis, sectionId)
                    .map(totalIssues => ({ analysis, totalIssues }))
            );
    }

    private buildIssues(
        params: Omit<CreateIssueUseCaseOptions, "qualityAnalysisId"> & AnalysisAndTotalIssues
    ): QualityAnalysisIssue[] {
        const { issues, sectionId, analysis, totalIssues } = params;

        const sectionNumber = this.issueUseCase.getSectionNumber(analysis.sections, sectionId);
        const prefix = `${analysis.sequential.value}-${sectionNumber}`;

        return issues.map((issue, index) => {
            const currentNumber = totalIssues + 1 + index;
            const issueNumber = this.issueUseCase.generateIssueNumber(currentNumber, prefix);
            return this.issueUseCase.buildDefaultIssue(
                {
                    categoryOptionComboId: issue.categoryOptionComboId,
                    countryId: issue.countryId,
                    dataElementId: issue.dataElementId,
                    period: issue.period,
                    description: issue.description,
                    correlative: String(currentNumber),
                    issueNumber: issueNumber,
                },
                sectionId
            );
        });
    }
}

type CreateIssueUseCaseOptions = {
    issues: IssueTemplate[];
    qualityAnalysisId: Id;
    sectionId: Id;
};

type AnalysisAndTotalIssues = { analysis: QualityAnalysis; totalIssues: number };
