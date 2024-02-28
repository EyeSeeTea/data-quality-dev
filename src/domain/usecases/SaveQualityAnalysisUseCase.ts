import { FutureData } from "../../data/api-futures";
import { QualityAnalysis } from "../entities/QualityAnalysis";
import { QualityAnalysisRepository } from "../repositories/QualityAnalysisRepository";

export class SaveQualityAnalysisUseCase {
    constructor(private qualityAnalysisRepository: QualityAnalysisRepository) {}

    execute(qualityAnalyses: QualityAnalysis[]): FutureData<void> {
        return this.qualityAnalysisRepository.save(qualityAnalyses);
    }
}
