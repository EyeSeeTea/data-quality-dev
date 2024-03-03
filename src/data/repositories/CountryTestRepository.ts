import { FutureData } from "../api-futures";
import _ from "../../domain/entities/generic/Collection";
import { Country } from "../../domain/entities/Country";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { Future } from "$/domain/entities/generic/Future";

export class CountryTestRepository implements CountryRepository {
    getByIds(): FutureData<Country[]> {
        return Future.success([]);
    }
}
