import { MetadataItem } from "$/domain/entities/MetadataItem";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { Future } from "$/domain/entities/generic/Future";
import { AnalysisSectionRepository } from "$/domain/repositories/AnalysisSectionRepository";
import { FutureData } from "../api-futures";

export class AnalysisSectionD2Repository implements AnalysisSectionRepository {
    constructor(private metadata: MetadataItem) {}

    get(): FutureData<QualityAnalysisSection[]> {
        const sections = this.metadata.programs.qualityIssues.programStages.map(programStage => {
            return QualityAnalysisSection.create({
                id: programStage.id,
                description: programStage.description,
                name: programStage.name,
                issues: [],
                status: "",
            });
        });
        return Future.success(sections);
    }
}
