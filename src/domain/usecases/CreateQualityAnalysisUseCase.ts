import { getUid } from "$/utils/uid";
import { FutureData } from "../../data/api-futures";
import { QualityAnalysis } from "../entities/QualityAnalysis";
import { QualityAnalysisSection } from "../entities/QualityAnalysisSection";
import { getErrors } from "../entities/generic/Errors";
import { Future } from "../entities/generic/Future";
import { AnalysisSectionRepository } from "../repositories/AnalysisSectionRepository";
import { QualityAnalysisRepository } from "../repositories/QualityAnalysisRepository";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { UserRepository } from "../repositories/UserRepository";

export class CreateQualityAnalysisUseCase {
    constructor(
        private qualityAnalysisRepository: QualityAnalysisRepository,
        private userRepository: UserRepository,
        private settingsRepository: SettingsRepository,
        private analysisSectionRepository: AnalysisSectionRepository
    ) {}

    execute(options: CreateQualityAnalysisOptions): FutureData<void> {
        return Future.joinObj({
            currentUser: this.userRepository.getCurrent(),
            defaultSettings: this.settingsRepository.get(),
            sections: this.analysisSectionRepository.get(),
        }).flatMap(({ currentUser, defaultSettings, sections }) => {
            const qualityAnalysisName = QualityAnalysis.buildDefaultName(
                options.qualityAnalysis.name,
                currentUser.username
            );

            return QualityAnalysis.build({
                endDate: defaultSettings.endDate,
                id: getUid(`quality-analysis_${new Date().getTime()}`),
                module: options.qualityAnalysis.module,
                name: qualityAnalysisName,
                sections: sections.map(section => {
                    return QualityAnalysisSection.create({
                        ...section,
                        status: QualityAnalysisSection.getInitialStatus(),
                    });
                }),
                startDate: defaultSettings.startDate,
                status: "In Progress",
                lastModification: "",
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
