import React from "react";
import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";

import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";

export type AddIssueDialogProps = {
    onAddIssue: (issues: QualityAnalysisIssue[]) => void;
    onClose: () => void;
};

export const AddIssueDialog: React.FC<AddIssueDialogProps> = props => {
    const { onAddIssue, onClose } = props;

    const onSave = React.useCallback(() => {
        onAddIssue([]);
    }, [onAddIssue]);

    return (
        <ConfirmationDialog
            isOpen={true}
            title={"Add Issue"}
            onSave={onSave}
            onCancel={onClose}
        ></ConfirmationDialog>
    );
};
