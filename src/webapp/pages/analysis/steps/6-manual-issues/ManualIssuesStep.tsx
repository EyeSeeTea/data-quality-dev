import React from "react";

import { UserFeedbackContainer } from "$/webapp/components/user-feedback-container/UserFeedbackContainer";
import { StepAnalysis } from "$/webapp/pages/analysis/steps/StepAnalysis";
import { useManualIssuesStep } from "$/webapp/pages/analysis/steps/6-manual-issues/useManualIssuesStep";
import { PageStepProps } from "$/webapp/pages/analysis/AnalysisPage";
import i18n from "$/utils/i18n";
import { AddIssueDialog } from "$/webapp/components/add-issue-dialog/AddIssueDialog";

export const ManualIssuesStep: React.FC<PageStepProps> = props => {
    const { analysis, section, title, updateAnalysis } = props;

    const { isLoading, error, openAddIssueDialog, addIssueDialogProps } = useManualIssuesStep({
        analysis,
        section,
        updateAnalysis,
    });
    return (
        <UserFeedbackContainer
            isLoading={isLoading}
            error={error}
            loadingText={i18n.t("Adding issues...")}
        >
            {addIssueDialogProps && <AddIssueDialog {...addIssueDialogProps} />}
            <StepAnalysis
                id={analysis.id}
                section={section}
                title={title}
                reload={0}
                onRun={openAddIssueDialog}
                allowRerun
                runButtonText={i18n.t("New Issue")}
                emptyMessage={i18n.t("No Issues Found")}
            ></StepAnalysis>
        </UserFeedbackContainer>
    );
};
