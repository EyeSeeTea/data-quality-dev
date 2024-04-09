import { FutureData } from "$/data/api-futures";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { Id } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import { IssueRepository } from "$/domain/repositories/IssueRepository";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";
import _ from "$/domain/entities/generic/Collection";
import { getUid } from "$/utils/uid";
import { UCIssue } from "./common/UCIssue";
import { UCAnalysis } from "./common/UCAnalysis";
import { ValidationRuleAnalysisRepository } from "../repositories/ValidationRuleAnalysisRepository";
import { ValidationRuleAnalysis } from "../entities/ValidationRuleAnalysis";
import { QualityAnalysisIssue } from "../entities/QualityAnalysisIssue";
import { IssueStatus } from "../entities/IssueStatus";
import { ValidationRuleGroupRepository } from "../repositories/ValidationRuleGroupRepository";
import { ValidationRuleGroup } from "../entities/ValidationRuleGroup";

export class RunValidationsUseCase {
    issueUseCase: UCIssue;
    analysisUseCase: UCAnalysis;
    constructor(
        private analysisRepository: QualityAnalysisRepository,
        private issueRepository: IssueRepository,
        private validationRuleAnalysisRepository: ValidationRuleAnalysisRepository,
        private validationRuleGroupRepository: ValidationRuleGroupRepository
    ) {
        this.analysisUseCase = new UCAnalysis(this.analysisRepository);
        this.issueUseCase = new UCIssue(this.issueRepository);
    }
    execute(options: RunValidationsUseCaseOptions): FutureData<QualityAnalysis> {
        return Future.joinObj({
            analysis: this.analysisUseCase.getById(options.qualityAnalysisId),
            validationRuleGroup: this.validationRuleGroupRepository.getById(
                options.validationRuleGroupId
            ),
        }).flatMap(({ analysis, validationRuleGroup }) => {
            return this.getValidationRuleAnalysis(analysis, options).flatMap(rules => {
                return this.issueUseCase
                    .getTotalIssuesBySection(analysis, options.sectionId)
                    .flatMap(totalIssues => {
                        return this.saveIssues(
                            rules,
                            analysis,
                            totalIssues,
                            options,
                            validationRuleGroup
                        ).flatMap(() => {
                            const analysisUpdate = this.analysisUseCase.updateAnalysis(
                                analysis,
                                options.sectionId,
                                totalIssues
                            );
                            return this.analysisRepository.save([analysisUpdate]).flatMap(() => {
                                return Future.success(analysisUpdate);
                            });
                        });
                    });
            });
        });
    }

    private getValidationRuleAnalysis(
        analysis: QualityAnalysis,
        options: RunValidationsUseCaseOptions
    ) {
        const concurrencyRequest = 1;
        const $requests = Future.parallel(
            analysis.countriesAnalysis.map(countryId =>
                this.validationRuleAnalysisRepository.get({
                    countryId: countryId,
                    startDate: analysis.startDate,
                    endDate: analysis.endDate,
                    validationRuleGroupId: options.validationRuleGroupId,
                })
            ),
            { concurrency: concurrencyRequest }
        );
        return $requests.flatMap(result => {
            const rules = _(result).flatten().value();
            return Future.success(rules);
        });
    }

    private saveIssues(
        rules: ValidationRuleAnalysis[],
        analysis: QualityAnalysis,
        totalIssues: number,
        options: RunValidationsUseCaseOptions,
        validationRuleGroup: ValidationRuleGroup
    ): FutureData<void> {
        if (rules.length === 0) return Future.success(undefined);
        const issuesToSave = rules.map((rule, index) => {
            const currentNumber = totalIssues + 1 + index;
            const correlative = currentNumber < 10 ? `0${currentNumber}` : currentNumber;
            const issueNumber = `${analysis.sequential.value}-S01-I${correlative}`;
            return new QualityAnalysisIssue({
                id: getUid(`issue-event_${options.sectionId}_${new Date().getTime()}`),
                number: issueNumber,
                azureUrl: "",
                period: rule.period,
                country: { id: rule.countryId, name: "", path: "", writeAccess: false },
                dataElement: undefined,
                categoryOption: { id: rule.categoryOptionId, name: "" },
                description: validationRuleGroup.description
                    ? `Validation Rule ${validationRuleGroup.description} for ${validationRuleGroup.name} failed: ${rule.leftValue} ${rule.operator} ${rule.rightValue}`
                    : `Validation Rule Group ${validationRuleGroup.name} failed: ${rule.leftValue} ${rule.operator} ${rule.rightValue}`,
                followUp: false,
                status: IssueStatus.create({
                    id: "",
                    code: "0",
                    name: "",
                }),
                action: undefined,
                actionDescription: "",
                type: options.sectionId,
                comments: "",
                contactEmails: "",
                correlative: String(currentNumber),
            });
        });
        return this.issueUseCase.save(issuesToSave, analysis.id);
    }
}

type RunValidationsUseCaseOptions = {
    qualityAnalysisId: Id;
    validationRuleGroupId: Id;
    sectionId: Id;
};
