import { FutureData } from "$/data/api-futures";
import { IssueStatus } from "$/domain/entities/IssueStatus";
import { Outlier } from "$/domain/entities/Outlier";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { Id } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import { getUid } from "$/utils/uid";
import { IssueRepository } from "$/domain/repositories/IssueRepository";
import { OutlierRepository } from "$/domain/repositories/OutlierRepository";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";
import _ from "$/domain/entities/generic/Collection";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";
import { DataElement } from "$/domain/entities/DataElement";
import { UCIssue } from "./common/UCIssue";
import { UCAnalysis } from "./common/UCAnalysis";

export class RunOutlierUseCase {
    issueUseCase: UCIssue;
    analysisUseCase: UCAnalysis;
    constructor(
        private outlierRepository: OutlierRepository,
        private analysisRepository: QualityAnalysisRepository,
        private issueRepository: IssueRepository,
        private moduleRepository: ModuleRepository
    ) {
        this.analysisUseCase = new UCAnalysis(this.analysisRepository);
        this.issueUseCase = new UCIssue(this.issueRepository);
    }

    execute(options: RunOutlierUseCaseOptions): FutureData<QualityAnalysis> {
        return this.analysisUseCase.getById(options.qualityAnalysisId).flatMap(analysis => {
            return this.getNumericDataElements(analysis.module.id).flatMap(dataElements => {
                return this.getOutliers(
                    options,
                    analysis.startDate,
                    analysis.endDate,
                    analysis.countriesAnalysis,
                    dataElements.map(dataElement => dataElement.id)
                ).flatMap(outliers => {
                    return this.issueUseCase
                        .getTotalIssuesBySection(analysis, options.sectionId)
                        .flatMap(totalIssues => {
                            return this.saveIssues(outliers, analysis, totalIssues, options);
                        })
                        .flatMap(() => {
                            const analysisToUpdate = this.analysisUseCase.updateAnalysis(
                                analysis,
                                options.sectionId,
                                outliers.length
                            );
                            return this.analysisRepository
                                .save([analysisToUpdate])
                                .map(() => analysisToUpdate);
                        });
                });
            });
        });
    }

    private getNumericDataElements(moduleId: Id): FutureData<DataElement[]> {
        return this.moduleRepository.getByIds([moduleId]).flatMap(modules => {
            const module = modules[0];
            if (!module) return Future.error(new Error(`Cannot find module: ${moduleId}`));
            return Future.success(module.dataElements.filter(dataElement => dataElement.isNumber));
        });
    }

    private getOutliers(
        options: RunOutlierUseCaseOptions,
        startDate: string,
        endDate: string,
        countryIds: Id[],
        dataElements: Id[]
    ): FutureData<Outlier[]> {
        const $requests = _(dataElements)
            .chunk(100)
            .map(dataElementsIds => {
                return this.outlierRepository.export({
                    algorithm: options.algorithm,
                    countryIds: countryIds,
                    endDate: endDate,
                    startDate: startDate,
                    moduleId: undefined,
                    threshold: options.threshold,
                    dataElementIds: dataElementsIds,
                });
            })
            .value();
        return Future.sequential($requests).flatMap(result => {
            return Future.success(_(result).flatten().value());
        });
    }

    private saveIssues(
        outliers: Outlier[],
        analysis: QualityAnalysis,
        totalIssues: number,
        options: RunOutlierUseCaseOptions
    ): FutureData<void> {
        if (outliers.length === 0) return Future.success(undefined);
        const issuesToSave = outliers.map((outlier, index) => {
            const currentNumber = totalIssues + 1 + index;
            const correlative = currentNumber < 10 ? `0${currentNumber}` : currentNumber;
            const issueNumber = `${analysis.sequential.value}-S01-I${correlative}`;
            return new QualityAnalysisIssue({
                id: getUid(`issue-event_${options.sectionId}_${new Date().getTime()}`),
                number: issueNumber,
                azureUrl: "",
                period: outlier.period,
                country: { id: outlier.countryId, name: "", path: "" },
                dataElement: { id: outlier.dataElementId, name: "" },
                categoryOption: { id: outlier.categoryOptionId, name: "" },
                description: this.getDescriptionIssue(outlier, options),
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

    private getDescriptionIssue(outlier: Outlier, options: RunOutlierUseCaseOptions): string {
        return outlier.zScore
            ? `An outlier was detected using ${
                  options.algorithm
              } with a value of ${outlier.zScore.toFixed(2)}, which is over the threshold ${
                  options.threshold
              } configured`
            : "";
    }
}

type RunOutlierUseCaseOptions = {
    qualityAnalysisId: Id;
    algorithm: string;
    threshold: string;
    sectionId: Id;
};
