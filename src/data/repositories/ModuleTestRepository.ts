import { NamedRef } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";
import { FutureData } from "../api-futures";

export class ModuleTestRepository implements ModuleRepository {
    get(): FutureData<NamedRef[]> {
        return Future.success([]);
    }
}
