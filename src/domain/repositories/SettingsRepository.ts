import { FutureData } from "../../data/api-futures";
import { Settings } from "../entities/Settings";

export interface SettingsRepository {
    get(): FutureData<Settings>;
}
