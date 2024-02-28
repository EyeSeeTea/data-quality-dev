import { Outlier } from "$/domain/entities/Outlier";
import { Id } from "$/domain/entities/Ref";
import { FutureData } from "../../data/api-futures";

export interface OutlierRepository {
    export(options: OutlierOptions): FutureData<Outlier[]>;
}

export type OutlierOptions = {
    moduleId: Id;
    countryIds: Id[];
    startDate: string;
    endDate: string;
    algorithm: string;
    threshold: string;
};
