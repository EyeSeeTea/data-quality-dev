import { Id } from "$/domain/entities/Ref";
import { getUid } from "$/utils/uid";
import { FutureData } from "../../data/api-futures";
import { QualityAnalysis } from "../entities/QualityAnalysis";
import { QualityAnalysisSection } from "../entities/QualityAnalysisSection";
import { getErrors } from "../entities/generic/Errors";
import { Future } from "../entities/generic/Future";
import { AnalysisSectionRepository } from "../repositories/AnalysisSectionRepository";
import { QualityAnalysisRepository } from "../repositories/QualityAnalysisRepository";
import { SequentialRepository } from "../repositories/SequentialRepository";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { UserRepository } from "../repositories/UserRepository";

export class CreateQualityAnalysisUseCase {
    constructor(
        private qualityAnalysisRepository: QualityAnalysisRepository,
        private userRepository: UserRepository,
        private settingsRepository: SettingsRepository,
        private analysisSectionRepository: AnalysisSectionRepository,
        private sequentialRepository: SequentialRepository
    ) {}

    execute(options: CreateQualityAnalysisOptions): FutureData<Id> {
        return Future.joinObj({
            currentUser: this.userRepository.getCurrent(),
            defaultSettings: this.settingsRepository.get(),
            sections: this.analysisSectionRepository.get(),
            sequential: this.sequentialRepository.get(),
        }).flatMap(({ currentUser, defaultSettings, sections, sequential }) => {
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
                countriesAnalysis: defaultSettings.countryIds,
                sequential: {
                    value: `DQ-${sequential.value}`,
                },
            }).match({
                error: errors => {
                    const errorMessages = getErrors(errors);
                    return Future.error(new Error(errorMessages));
                },
                success: entity => {
                    return this.qualityAnalysisRepository.save([entity]).map(() => entity.id);
                },
            });
        });
    }
}

type CreateQualityAnalysisOptions = {
    qualityAnalysis: Pick<QualityAnalysis, "name" | "module">;
};
