import { RemoveQualityUseCase } from "$/domain/usecases/RemoveQualityUseCase";
import { AnalysisSectionD2Repository } from "./data/repositories/AnalysisSectionD2Repository";
import { AnalysisSectionTestRepository } from "./data/repositories/AnalysisSectionTestRepository";
import { MetadataD2Repository } from "./data/repositories/MetadataD2Repository";
import { MetadataTestRepository } from "./data/repositories/MetadataTestRepository";
import { ModuleD2Repository } from "./data/repositories/ModuleD2Repository";
import { ModuleTestRepository } from "./data/repositories/ModuleTestRepository";
import { QualityAnalysisD2Repository } from "./data/repositories/QualityAnalysisD2Repository";
import { QualityAnalysisTestRepository } from "./data/repositories/QualityAnalysisTestRepository";
import { SettingsD2Repository } from "./data/repositories/SettingsD2Repository";
import { SettingsTestRepository } from "./data/repositories/SettingsTestRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { MetadataItem } from "./domain/entities/MetadataItem";
import { AnalysisSectionRepository } from "./domain/repositories/AnalysisSectionRepository";
import { MetadataRepository } from "./domain/repositories/MetadataRepository";
import { ModuleRepository } from "./domain/repositories/ModuleRepository";
import { QualityAnalysisRepository } from "./domain/repositories/QualityAnalysisRepository";
import { SettingsRepository } from "./domain/repositories/SettingsRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { CreateQualityAnalysisUseCase } from "./domain/usecases/CreateQualityAnalysisUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetModulesUseCase } from "./domain/usecases/GetModulesUseCase";
import { GetQualityAnalysisUseCase } from "./domain/usecases/GetQualityAnalisysUseCase";
import { SaveQualityAnalysisUseCase } from "./domain/usecases/SaveQualityAnalysisUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    qualityAnalysisRepository: QualityAnalysisRepository;
    metadataRepository: MetadataRepository;
    settingsRepository: SettingsRepository;
    moduleRepository: ModuleRepository;
    analysisSectionRepository: AnalysisSectionRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: { getCurrent: new GetCurrentUserUseCase(repositories.usersRepository) },
        modules: { get: new GetModulesUseCase(repositories.moduleRepository) },
        qualityAnalysis: {
            get: new GetQualityAnalysisUseCase(repositories.qualityAnalysisRepository),
            save: new SaveQualityAnalysisUseCase(repositories.qualityAnalysisRepository),
            create: new CreateQualityAnalysisUseCase(
                repositories.qualityAnalysisRepository,
                repositories.usersRepository,
                repositories.settingsRepository,
                repositories.analysisSectionRepository
            ),
            remove: new RemoveQualityUseCase(repositories.qualityAnalysisRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api, metadata: MetadataItem) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        qualityAnalysisRepository: new QualityAnalysisD2Repository(api, metadata),
        metadataRepository: new MetadataD2Repository(api),
        settingsRepository: new SettingsD2Repository(api),
        moduleRepository: new ModuleD2Repository(metadata),
        analysisSectionRepository: new AnalysisSectionD2Repository(metadata),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        qualityAnalysisRepository: new QualityAnalysisTestRepository(),
        metadataRepository: new MetadataTestRepository(),
        settingsRepository: new SettingsTestRepository(),
        moduleRepository: new ModuleTestRepository(),
        analysisSectionRepository: new AnalysisSectionTestRepository(),
    };

    return getCompositionRoot(repositories);
}
