import { Struct } from "./generic/Struct";
import { QualityAnalysisIssue } from "./QualityAnalysisIssue";
import { Id } from "./Ref";

export interface QualityAnalysisSectionAttrs {
    id: Id;
    name: string;
    issues: QualityAnalysisIssue[];
    status: string;
}

export class QualityAnalysisSection extends Struct<QualityAnalysisSectionAttrs>() {
    static getInitialStatus(): string {
        return "pending";
    }
}
