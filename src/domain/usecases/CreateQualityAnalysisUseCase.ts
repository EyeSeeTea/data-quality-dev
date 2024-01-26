import { FutureData } from "../../data/api-futures";
import { QualityAnalysis } from "../entities/QualityAnalysis";
import { getErrors } from "../entities/generic/Errors";
import { Future } from "../entities/generic/Future";
import { QualityAnalysisRepository } from "../repositories/QualityAnalysisRepository";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { UserRepository } from "../repositories/UserRepository";

export class CreateQualityAnalysisUseCase {
    constructor(
        private qualityAnalysisRepository: QualityAnalysisRepository,
        private userRepository: UserRepository,
        private settingsRepository: SettingsRepository
    ) {}

    execute(options: CreateQualityAnalysisOptions): FutureData<void> {
        return Future.joinObj({
            currentUser: this.userRepository.getCurrent(),
            defaultSettings: this.settingsRepository.get(),
        }).flatMap(({ currentUser, defaultSettings }) => {
            const qualityAnalysisName = QualityAnalysis.buildDefaultName(
                options.qualityAnalysis.name,
                currentUser.username
            );

            return QualityAnalysis.build({
                endDate: defaultSettings.endDate,
                id: "",
                module: options.qualityAnalysis.module,
                name: qualityAnalysisName,
                sections: [],
                startDate: defaultSettings.startDate,
                status: "pending",
            }).match({
                error: errors => {
                    const errorMessages = getErrors(errors);
                    return Future.error(new Error(errorMessages));
                },
                success: entity => {
                    return this.qualityAnalysisRepository.save([entity]);
                },
            });
        });
    }
}

type CreateQualityAnalysisOptions = {
    qualityAnalysis: Pick<QualityAnalysis, "name" | "module">;
};
