import { FutureData } from "$/data/api-futures";
import { Outlier } from "$/domain/entities/Outlier";
import { RowsPaginated } from "$/domain/entities/Pagination";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { Id } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import { getUid } from "$/utils/uid";
import { AnalysisSectionRepository } from "../repositories/AnalysisSectionRepository";
import { IssueRepository } from "../repositories/IssueRepository";
import { OutlierRepository } from "../repositories/OutlierRepository";
import { QualityAnalysisRepository } from "../repositories/QualityAnalysisRepository";

const programStageId = "qWR8EkkI7i7";

export class RunOutlierUseCase {
    constructor(
        private outlierRepository: OutlierRepository,
        private analysisRepository: QualityAnalysisRepository,
        private issueRepository: IssueRepository,
        private analysisSectionRepository: AnalysisSectionRepository
    ) {}

    execute(options: RunOutlierUseCaseOptions): FutureData<void> {
        return Future.joinObj({
            analysis: this.getQualityAnalysis(options.qualityAnalysisId),
            sections: this.analysisSectionRepository.get(),
        }).flatMap(({ analysis, sections }) => {
            return this.getOutliers(
                options,
                analysis.startDate,
                analysis.endDate,
                analysis.module.id
            ).flatMap(outliers => {
                return this.getIssues(analysis.id)
                    .flatMap(issues => {
                        const totalIssues = issues.pagination.total;
                        return this.saveIssues(outliers, analysis.id, totalIssues);
                    })
                    .flatMap(() => {
                        const analysisToUpdate = QualityAnalysis.build({
                            ...analysis,
                            sections: sections.map(section => {
                                if (section.id !== programStageId) return section;
                                return QualityAnalysisSection.create({
                                    ...section,
                                    status: outliers.length === 0 ? "In Progress" : "Completed",
                                });
                            }),
                        }).get();
                        return this.analysisRepository
                            .save([analysisToUpdate])
                            .map(() => undefined);
                    });
            });
        });
    }

    private getQualityAnalysis(id: Id): FutureData<QualityAnalysis> {
        return this.analysisRepository
            .get({
                filters: {
                    endDate: undefined,
                    ids: [id],
                    module: undefined,
                    name: undefined,
                    startDate: undefined,
                    status: undefined,
                },
                pagination: {
                    page: 1,
                    pageSize: 1e6,
                },
                sorting: {
                    field: "name",
                    order: "desc",
                },
            })
            .map(result => {
                const analysis = result.rows[0];
                if (!analysis) {
                    throw new Error(`Quality analysis not found: ${id}`);
                }
                return analysis;
            });
    }

    private getOutliers(
        options: RunOutlierUseCaseOptions,
        startDate: string,
        endDate: string,
        moduleId: string
    ): FutureData<Outlier[]> {
        return this.outlierRepository.export({
            algorithm: options.algorithm,
            countryIds: ["H8RixfF8ugH"],
            endDate: endDate,
            startDate: startDate,
            moduleId: moduleId,
            threshold: options.threshold,
        });
    }

    private getIssues(qualityAnalysisId: Id): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        return this.issueRepository.get({ ids: [qualityAnalysisId], programStage: programStageId });
    }

    private saveIssues(outliers: Outlier[], analysisId: Id, totalIssues: number): FutureData<void> {
        const issuesToSave = outliers.map((outlier, index) => {
            /*
            DQ01 -> TEA autoincremental del Tracker Program
            S01 -> A nivel de código sabemos en qué step estamos
            I01
          */
            const issueNumber = `S01-I${totalIssues + 1 + index}`;
            return new QualityAnalysisIssue({
                id: getUid(`issue-event_${programStageId}_${new Date().getTime()}`),
                number: issueNumber,
                azureUrl: "",
                period: outlier.period,
                country: { id: outlier.countryId, name: "" },
                dataElement: { id: outlier.dataElementId, name: "" },
                categoryOption: { id: outlier.categoryOptionId, name: "" },
                description: "",
                followUp: false,
                status: undefined,
                action: undefined,
                actionDescription: "",
                type: programStageId,
            });
        });
        return this.issueRepository.save(issuesToSave, analysisId);
    }
}

type RunOutlierUseCaseOptions = {
    qualityAnalysisId: Id;
    algorithm: string;
    threshold: string;
};
