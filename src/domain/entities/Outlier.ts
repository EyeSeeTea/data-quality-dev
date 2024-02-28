import { Id, Period } from "$/domain/entities/Ref";

export type Outlier = {
    dataElementId: Id;
    countryId: Id;
    categoryOptionId: Id;
    period: Period;
};
