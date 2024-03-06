import { FutureData } from "../../data/api-futures";
import { QualityAnalysis } from "../entities/QualityAnalysis";
import { Future } from "../entities/generic/Future";
import { QualityAnalysisRepository } from "../repositories/QualityAnalysisRepository";

export class SaveConfigAnalysisUseCase {
    constructor(private qualityAnalysisRepository: QualityAnalysisRepository) {}

    execute(options: SaveQualityAnalysisOptions): FutureData<void> {
        if (QualityAnalysis.hasExecutedSections(options.qualityAnalysis)) {
            return Future.error(new Error("Cannot change analysis with executed sections"));
        }
        const qualityAnalysisToSave = QualityAnalysis.build(options.qualityAnalysis).get();
        return this.qualityAnalysisRepository.save([qualityAnalysisToSave]);
    }
}

type SaveQualityAnalysisOptions = { qualityAnalysis: QualityAnalysis };
