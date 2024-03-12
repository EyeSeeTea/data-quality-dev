import { FutureData } from "$/data/api-futures";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { Id } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import { IssueRepository } from "$/domain/repositories/IssueRepository";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";
import { SettingsRepository } from "$/domain/repositories/SettingsRepository";
import { Maybe } from "$/utils/ts-utils";

export function getAnalysisAndDefaultSettings(
    qualityAnalysisRepository: QualityAnalysisRepository,
    settingsRepository: SettingsRepository,
    id: Id
) {
    return Future.joinObj({
        analysis: getQualityAnalysis(qualityAnalysisRepository, id),
        defaultSettings: settingsRepository.get(),
    });
}

export function getQualityAnalysis(
    analysisRepository: QualityAnalysisRepository,
    id: Id
): FutureData<QualityAnalysis> {
    return analysisRepository.getById(id).map(analysis => {
        return analysis;
    });
}

export function getCurrentSection(
    analysis: QualityAnalysis,
    sectionName: string
): QualityAnalysisSection {
    const section = analysis.sections.find(section => section.name === sectionName);
    if (!section) throw Error(`Cannot found section: ${sectionName}`);
    return section;
}

export function getIssues(
    issueRepository: IssueRepository,
    analysis: QualityAnalysis,
    sectionName: string
): FutureData<number> {
    const section = getCurrentSection(analysis, sectionName);
    return issueRepository
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

export function convertToNumberOrZero(value: Maybe<string>): number {
    return Number(value) || 0;
}