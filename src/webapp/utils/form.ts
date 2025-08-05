import { Collection } from "$/domain/entities/generic/Collection";

export function generatePeriodYearOptions(startYear: number, endYear: number) {
    return Collection.range(startYear, endYear + 1)
        .map(year => ({ value: year.toString(), text: year.toString() }))
        .reverse()
        .value();
}
