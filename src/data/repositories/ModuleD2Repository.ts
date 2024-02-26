import { MetadataItem } from "$/domain/entities/MetadataItem";
import { NamedRef } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";
import { FutureData } from "../api-futures";

export class ModuleD2Repository implements ModuleRepository {
    constructor(private metadata: MetadataItem) {}

    get(): FutureData<NamedRef[]> {
        return Future.success([this.metadata.dataSets.module1, this.metadata.dataSets.module2]);
    }
}
