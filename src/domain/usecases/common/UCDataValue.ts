import _ from "lodash";

import { FutureData } from "$/data/api-futures";
import { DataValue } from "$/domain/entities/DataValue";
import { Id, Period } from "$/domain/entities/Ref";
import { DataValueRepository } from "$/domain/repositories/DataValueRepository";
import { Future } from "$/domain/entities/generic/Future";

export class UCDataValue {
    constructor(private dataValueRepository: DataValueRepository) {}

    get(countriesIds: Id[], moduleIds: Id[], periods: Period[]): FutureData<DataValue[]> {
        const $requests = _(countriesIds)
            .chunk(1)
            .map(countryIds => {
                return this.dataValueRepository.get({
                    moduleIds: moduleIds,
                    countriesIds: countryIds,
                    period: _(periods).uniq().value(),
                });
            })
            .value();

        return Future.sequential($requests).flatMap(result => {
            return Future.success(_(result).flatten().value());
        });
    }

    getByCountryAndPeriod(dataValues: DataValue[]): Record<string, DataValue[]> {
        return _(dataValues)
            .groupBy(dataValue => {
                return `${dataValue.countryId}.${dataValue.period}`;
            })
            .value();
    }
}
