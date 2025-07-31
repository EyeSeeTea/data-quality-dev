import React from "react";
import { Maybe } from "$/utils/ts-utils";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { UpdateAnalysisState } from "$/webapp/pages/analysis/AnalysisPage";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { AddIssueDialogProps } from "$/webapp/components/add-issue-dialog/AddIssueDialog";

type UseManualStepProps = {
    analysis: QualityAnalysis;
    section: QualityAnalysisSection;
    updateAnalysis: UpdateAnalysisState;
};

export function useManualIssuesStep(props: UseManualStepProps) {
    const { analysis, section, updateAnalysis } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<Maybe<string>>(undefined);
    const [reload, refreshReload] = React.useState(0);
    const [addIssueDialogProps, setAddIssueDialogProps] = React.useState<AddIssueDialogProps>();

    const onAddIssues = React.useCallback((issues: QualityAnalysisIssue[]) => {
        console.log(issues);
    }, []);

    const closeAddIssueDialog = React.useCallback(() => {
        setAddIssueDialogProps(undefined);
    }, []);

    const openAddIssueDialog = React.useCallback(() => {
        setAddIssueDialogProps({
            onAddIssue: (issues: QualityAnalysisIssue[]) => {
                onAddIssues(issues);
                closeAddIssueDialog();
            },
            onClose: closeAddIssueDialog,
            analysis: analysis,
        });
    }, [onAddIssues, closeAddIssueDialog, analysis]);

    return {
        isLoading,
        error,
        reload,
        addIssueDialogProps,
        openAddIssueDialog,
        onAddIssues,
    };
}
