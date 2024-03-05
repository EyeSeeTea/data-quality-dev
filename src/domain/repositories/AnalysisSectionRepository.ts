import { FutureData } from "$/data/api-futures";
import { QualityAnalysisSection } from "../entities/QualityAnalysisSection";

export interface AnalysisSectionRepository {
    get(): FutureData<QualityAnalysisSection[]>;
}
