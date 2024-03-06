import { FutureData } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";

export class RemoveQualityUseCase {
    constructor(private qualityAnalysisRepository: QualityAnalysisRepository) {}

    execute(qualityAnalysisIds: Id[]): FutureData<void> {
        return this.qualityAnalysisRepository.remove(qualityAnalysisIds);
    }
}
