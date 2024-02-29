export const qualityAnalysisStatus = ["pending", "finished", "finished_without_issues"] as const;
export type QualityAnalysisStatus = (typeof qualityAnalysisStatus)[number];
