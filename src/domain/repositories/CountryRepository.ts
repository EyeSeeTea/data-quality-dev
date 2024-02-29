import { FutureData } from "../../data/api-futures";
import { Country } from "../entities/Country";
import { Id } from "../entities/Ref";

export interface CountryRepository {
    getByIds(ids: Id[]): FutureData<Country[]>;
}
