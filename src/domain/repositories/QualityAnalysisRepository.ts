import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { QualityAnalysis } from "../entities/QualityAnalysis";

export interface QualityAnalysisRepository {
    get(options: QualityAnalysisOptions): FutureData<QualityAnalysisPaginated>;
    save(qualityAnalyses: QualityAnalysis[]): FutureData<void>;
}

export type Pagination = {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
};

export type QualityAnalysisOptions = {
    pagination: Pick<Pagination, "page" | "pageSize">;
    sorting: { field: string; order: "asc" | "desc" };
    filters: {
        endDate: Maybe<string>;
        module: Maybe<string>;
        name: Maybe<string>;
        startDate: Maybe<string>;
        status: Maybe<string>;
    };
};

export type QualityAnalysisPaginated = {
    rows: QualityAnalysis[];
    pagination: Pagination;
};
