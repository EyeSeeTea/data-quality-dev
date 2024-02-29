import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";
import { Id } from "../../domain/entities/Ref";
import _ from "../../domain/entities/generic/Collection";
import { Country } from "../../domain/entities/Country";
import { CountryRepository } from "../../domain/repositories/CountryRepository";
import { D2OrgUnit } from "../common/D2Country";

export class CountryD2Repository implements CountryRepository {
    d2Country: D2OrgUnit;

    constructor(private api: D2Api) {
        this.d2Country = new D2OrgUnit(this.api);
    }

    getByIds(ids: Id[]): FutureData<Country[]> {
        return this.d2Country.getByIds(ids);
    }
}
