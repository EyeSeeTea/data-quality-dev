import React from "react";
import { Maybe } from "$/utils/ts-utils";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { UpdateAnalysisState } from "$/webapp/pages/analysis/AnalysisPage";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";

type UseManualStepProps = {
    analysis: QualityAnalysis;
    section: QualityAnalysisSection;
    updateAnalysis: UpdateAnalysisState;
};

export function useManualStep(props: UseManualStepProps) {
    const { analysis, section, updateAnalysis } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<Maybe<string>>(undefined);
    const [reload, refreshReload] = React.useState(0);
    const [addIssueDialogProps, setAddIssueDialogProps] = React.useState();

    const openAddIssueDialog = React.useCallback(() => {
        // setAddIssueDialogProps()
    }, []);

    const onAddIssues = React.useCallback((issues: QualityAnalysisIssue[]) => {
        console.log(issues);
    }, []);

    return {
        isLoading,
        error,
        reload,
        addIssueDialogProps,
        openAddIssueDialog,
        onAddIssues,
    };
}
