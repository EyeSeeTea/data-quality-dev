import { FutureData } from "$/data/api-futures";
import { Module } from "../entities/Module";
import { ModuleRepository } from "../repositories/ModuleRepository";

export class GetModulesUseCase {
    constructor(private moduleRepository: ModuleRepository) {}

    execute(): FutureData<Module[]> {
        return this.moduleRepository.get();
    }
}
