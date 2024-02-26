import { Struct } from "./generic/Struct";
import { QualityAnalysisIssue } from "./QualityAnalysisIssue";
import { Id } from "./Ref";

export interface QualityAnalysisSectionAttrs {
    id: Id;
    issues: QualityAnalysisIssue[];
    status: string;
}

export class QualityAnalysisSection extends Struct<QualityAnalysisSectionAttrs>() {}
