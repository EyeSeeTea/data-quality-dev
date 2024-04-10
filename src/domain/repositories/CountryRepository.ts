import { Maybe } from "$/utils/ts-utils";
import { FutureData } from "../../data/api-futures";
import { Country } from "../entities/Country";
import { Id } from "../entities/Ref";

export interface CountryRepository {
    getBy(options: CountryOptions): FutureData<Country[]>;
    getByIds(ids: Id[]): FutureData<Country[]>;
}

export type CountryOptions = {
    level: Maybe<string>;
};
