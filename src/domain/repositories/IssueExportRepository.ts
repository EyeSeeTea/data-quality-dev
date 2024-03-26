import { FutureData } from "$/data/api-futures";
import { QualityAnalysisIssue } from "../entities/QualityAnalysisIssue";

export interface IssueExportRepository {
    export(issues: QualityAnalysisIssue[]): FutureData<void>;
}
