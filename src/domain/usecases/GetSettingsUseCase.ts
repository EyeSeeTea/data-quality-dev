import { FutureData } from "$/data/api-futures";
import { Settings } from "../entities/Settings";
import { SettingsRepository } from "../repositories/SettingsRepository";

export class GetSettingsUseCase {
    constructor(private settingsRepository: SettingsRepository) {}

    execute(): FutureData<Settings> {
        return this.settingsRepository.get();
    }
}
