import { FutureData } from "$/data/api-futures";
import { IssueStatus } from "$/domain/entities/IssueStatus";
import { Outlier } from "$/domain/entities/Outlier";
import { RowsPaginated } from "$/domain/entities/Pagination";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { Id } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import { getUid } from "$/utils/uid";
import { outlierKey } from "$/webapp/pages/analysis/steps";
import { IssueRepository } from "../repositories/IssueRepository";
import { OutlierRepository } from "../repositories/OutlierRepository";
import { QualityAnalysisRepository } from "../repositories/QualityAnalysisRepository";
import { SettingsRepository } from "../repositories/SettingsRepository";

export class RunOutlierUseCase {
    constructor(
        private outlierRepository: OutlierRepository,
        private analysisRepository: QualityAnalysisRepository,
        private issueRepository: IssueRepository,
        private settingsRepository: SettingsRepository
    ) {}

    execute(options: RunOutlierUseCaseOptions): FutureData<QualityAnalysis> {
        return Future.joinObj({
            analysis: this.getQualityAnalysis(options.qualityAnalysisId),
            defaultSettings: this.settingsRepository.get(),
        }).flatMap(({ analysis, defaultSettings }) => {
            return this.getOutliers(
                options,
                analysis.startDate,
                analysis.endDate,
                analysis.module.id,
                analysis.countriesAnalysis.length > 0
                    ? analysis.countriesAnalysis
                    : defaultSettings.countryIds
            ).flatMap(outliers => {
                return this.getIssues(analysis)
                    .flatMap(issues => {
                        const totalIssues = issues.pagination.total;
                        return this.saveIssues(outliers, analysis, totalIssues, options);
                    })
                    .flatMap(() => {
                        const analysisToUpdate = this.updateAnalysis(analysis, outliers);
                        return this.analysisRepository
                            .save([analysisToUpdate])
                            .map(() => analysisToUpdate);
                    });
            });
        });
    }

    private updateAnalysis(analysis: QualityAnalysis, outliers: Outlier[]): QualityAnalysis {
        return QualityAnalysis.build({
            ...analysis,
            lastModification: new Date().toISOString(),
            sections: analysis.sections.map(section => {
                if (section.name !== outlierKey) return section;
                return QualityAnalysisSection.create({
                    ...section,
                    status: outliers.length === 0 ? "success" : "success_with_issues",
                });
            }),
        }).get();
    }

    private getQualityAnalysis(id: Id): FutureData<QualityAnalysis> {
        return this.analysisRepository.getById(id).map(analysis => {
            return analysis;
        });
    }

    private getOutliers(
        options: RunOutlierUseCaseOptions,
        startDate: string,
        endDate: string,
        moduleId: string,
        countryIds: string[]
    ): FutureData<Outlier[]> {
        return this.outlierRepository.export({
            algorithm: options.algorithm,
            countryIds: countryIds,
            endDate: endDate,
            startDate: startDate,
            moduleId: moduleId,
            threshold: options.threshold,
        });
    }

    private getIssues(analysis: QualityAnalysis): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        const section = this.getCurrentSection(analysis);
        return this.issueRepository.get({
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
        });
    }

    private saveIssues(
        outliers: Outlier[],
        analysis: QualityAnalysis,
        totalIssues: number,
        options: RunOutlierUseCaseOptions
    ): FutureData<void> {
        const section = this.getCurrentSection(analysis);
        if (outliers.length === 0) return Future.success(undefined);
        const issuesToSave = outliers.map((outlier, index) => {
            const correlative =
                totalIssues + 1 + index < 10
                    ? `0${totalIssues + 1 + index}`
                    : totalIssues + 1 + index;
            const issueNumber = `S01-I${correlative}`;

            return new QualityAnalysisIssue({
                id: getUid(`issue-event_${outlierKey}_${new Date().getTime()}`),
                number: issueNumber,
                azureUrl: "",
                period: outlier.period,
                country: { id: outlier.countryId, name: "", path: "" },
                dataElement: { id: outlier.dataElementId, name: "" },
                categoryOption: { id: outlier.categoryOptionId, name: "" },
                description: "",
                followUp: false,
                status: IssueStatus.create({
                    id: "",
                    code: "0",
                    name: "",
                }),
                action: undefined,
                actionDescription: this.getActionDescription(outlier, options),
                type: section.id,
                comments: "",
                contactEmails: "",
            });
        });
        return this.issueRepository.create(issuesToSave, analysis.id);
    }

    private getCurrentSection(analysis: QualityAnalysis): QualityAnalysisSection {
        const section = analysis.sections.find(section => section.name === outlierKey);
        if (!section) throw Error(`Cannot found section: ${outlierKey}`);
        return section;
    }

    private getActionDescription(outlier: Outlier, options: RunOutlierUseCaseOptions): string {
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
};
