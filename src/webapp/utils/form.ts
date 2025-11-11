import { Collection } from "$/domain/entities/generic/Collection";

export const ORG_UNIT_LEVELS = [1, 2, 3];
export const ORG_UNIT_SELECTABLE_LEVELS = [2, 3];

export function generatePeriodYearOptions(startYear: number, endYear: number) {
    return Collection.range(startYear, endYear + 1)
        .map(year => ({ value: year.toString(), text: year.toString() }))
        .reverse()
        .value();
}
