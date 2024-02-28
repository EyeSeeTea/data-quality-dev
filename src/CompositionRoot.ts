import { MetadataD2Repository } from "./data/repositories/MetadataD2Repository";
import { MetadataTestRepository } from "./data/repositories/MetadataTestRepository";
import { QualityAnalysisD2Repository } from "./data/repositories/QualityAnalysisD2Repository";
import { QualityAnalysisTestRepository } from "./data/repositories/QualityAnalysisTestRepository";
import { SettingsD2Repository } from "./data/repositories/SettingsD2Repository";
import { SettingsTestRepository } from "./data/repositories/SettingsTestRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { MetadataItem } from "./domain/entities/MetadataItem";
import { MetadataRepository } from "./domain/repositories/MetadataRepository";
import { QualityAnalysisRepository } from "./domain/repositories/QualityAnalysisRepository";
import { SettingsRepository } from "./domain/repositories/SettingsRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { CreateQualityAnalysisUseCase } from "./domain/usecases/CreateQualityAnalysisUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetQualityAnalysisUseCase } from "./domain/usecases/GetQualityAnalisysUseCase";
import { SaveQualityAnalysisUseCase } from "./domain/usecases/SaveQualityAnalysisUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    qualityAnalysisRepository: QualityAnalysisRepository;
    metadataRepository: MetadataRepository;
    settingsRepository: SettingsRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: { getCurrent: new GetCurrentUserUseCase(repositories.usersRepository) },
        qualityAnalysis: {
            get: new GetQualityAnalysisUseCase(repositories.qualityAnalysisRepository),
            save: new SaveQualityAnalysisUseCase(repositories.qualityAnalysisRepository),
            create: new CreateQualityAnalysisUseCase(
                repositories.qualityAnalysisRepository,
                repositories.usersRepository,
                repositories.settingsRepository
            ),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api, metadata: MetadataItem) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        qualityAnalysisRepository: new QualityAnalysisD2Repository(api, metadata),
        metadataRepository: new MetadataD2Repository(api),
        settingsRepository: new SettingsD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        qualityAnalysisRepository: new QualityAnalysisTestRepository(),
        metadataRepository: new MetadataTestRepository(),
        settingsRepository: new SettingsTestRepository(),
    };

    return getCompositionRoot(repositories);
}
