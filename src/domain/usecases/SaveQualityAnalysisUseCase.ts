import { FutureData } from "../../data/api-futures";
import { QualityAnalysis } from "../entities/QualityAnalysis";
import { QualityAnalysisRepository } from "../repositories/QualityAnalysisRepository";

export class SaveQualityAnalysisUseCase {
    constructor(private qualityAnalysisRepository: QualityAnalysisRepository) {}

    execute(options: SaveQualityAnalysisOptions): FutureData<void> {
        const qualityAnalysisToSave = QualityAnalysis.build(options.qualityAnalysis).get();
        return this.qualityAnalysisRepository.save([qualityAnalysisToSave]);
    }
}

type SaveQualityAnalysisOptions = { qualityAnalysis: QualityAnalysis };
