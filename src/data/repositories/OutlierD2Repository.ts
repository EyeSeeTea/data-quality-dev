import { D2Api } from "$/types/d2-api";
import { OutlierOptions, OutlierRepository } from "$/domain/repositories/OutlierRepository";
import { FutureData, apiToFuture } from "../api-futures";
import { Id, Period } from "$/domain/entities/Ref";
import { Outlier } from "$/domain/entities/Outlier";

export class OutlierD2Repository implements OutlierRepository {
    constructor(private api: D2Api) {}

    export(options: OutlierOptions): FutureData<Outlier[]> {
        return apiToFuture(
            this.api.request<D2OutlierResponse>({
                method: "get",
                url: "/outlierDetection",
                params: {
                    ds: options.moduleId,
                    ou: options.countryIds,
                    startDate: options.startDate,
                    endDate: options.endDate,
                    algorithm: options.algorithm,
                    threshold: options.threshold,
                },
            })
        ).map(response => {
            return response.outlierValues.map(d2Outlier => this.buildOutliers(d2Outlier));
        });
    }

    private buildOutliers(d2Outlier: D2Outlier): Outlier {
        return {
            categoryOptionId: d2Outlier.coc,
            countryId: d2Outlier.ou,
            dataElementId: d2Outlier.de,
            period: d2Outlier.pe,
        };
    }
}

type D2Outlier = {
    de: Id;
    pe: Period;
    ou: Id;
    coc: Id;
    aoc: Id;
};

type D2OutlierResponse = {
    outlierValues: Array<D2Outlier>;
};
