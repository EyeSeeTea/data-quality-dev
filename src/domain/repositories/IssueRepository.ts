import { FutureData } from "../../data/api-futures";
import { QualityAnalysisIssue } from "../entities/QualityAnalysisIssue";

export interface IssueRepository {
    save(qualityAnalyses: QualityAnalysisIssue[]): FutureData<void>;
}
