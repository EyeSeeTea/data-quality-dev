import { FutureData } from "$/data/api-futures";
import { Module } from "$/domain/entities/Module";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";
import { Id } from "$/domain/entities/Ref";

export class GetModulesUseCase {
    constructor(private moduleRepository: ModuleRepository) {}

    execute(ids?: Id[]): FutureData<Module[]> {
        return ids?.length ? this.moduleRepository.getByIds(ids) : this.moduleRepository.get();
    }
}
