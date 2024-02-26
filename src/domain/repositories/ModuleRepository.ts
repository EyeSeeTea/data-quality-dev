import { FutureData } from "$/data/api-futures";
import { Module } from "../entities/Module";

export interface ModuleRepository {
    get(): FutureData<Module[]>;
}
