import { Sequential } from "$/domain/entities/Sequential";
import { SequentialRepository } from "$/domain/repositories/SequentialRepository";
import { FutureData } from "../api-futures";

export class SequentialTestRepository implements SequentialRepository {
    get(): FutureData<Sequential> {
        throw Error("Not implemented");
    }
}
