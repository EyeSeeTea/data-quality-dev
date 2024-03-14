import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { QualityAnalysis } from "../entities/QualityAnalysis";
import { Id } from "$/domain/entities/Ref";

export interface QualityAnalysisRepository {
    get(options: QualityAnalysisOptions): FutureData<QualityAnalysisPaginated>;
    getById(id: Id): FutureData<QualityAnalysis>;
    save(qualityAnalysis: QualityAnalysis[]): FutureData<void>;
    remove(id: Id): FutureData<void>;
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
        ids: Maybe<Id[]>;
    };
};

export type QualityAnalysisPaginated = {
    rows: QualityAnalysis[];
    pagination: Pagination;
};
