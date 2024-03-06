import React from "react";

import { InputInline } from "./InputInline";
import { IssuePropertyName, QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { CheckboxInline } from "./CheckboxInline";
import { SelectorInline } from "./SelectorInline";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { useParams } from "react-router-dom";

type UpdateIssuePropertyProps = {
    analysisId: Id;
    issue: QualityAnalysisIssue;
    field: IssuePropertyName;
};

export function useUpdateIssueProperty(props: UpdateIssuePropertyProps) {
    const { analysisId, field, issue } = props;
    const { compositionRoot } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();

    const updateIssue = React.useCallback(
        (value: string | boolean) => {
            loading.show(true, i18n.t("Updating Issue..."));
            compositionRoot.issues.save
                .execute({
                    analysisId: analysisId,
                    issue: issue,
                    propertyToUpdate: field,
                    valueToUpdate: value,
                })
                .run(
                    () => {
                        loading.hide();
                        snackbar.success(i18n.t("Issue Updated"));
                    },
                    err => {
                        snackbar.error(err.message);
                        loading.hide();
                    }
                );
        },
        [compositionRoot.issues.save, loading, snackbar, issue, analysisId, field]
    );

    return { updateIssue };
}

export const EditIssueValue: React.FC<EditIssueValueProps> = React.memo(props => {
    const { id } = useParams<{ id: string }>();
    const { metadata } = useAppContext();
    const { issue, field } = props;
    const { updateIssue } = useUpdateIssueProperty({
        analysisId: id,
        field: field,
        issue: issue,
    });

    const onSave = (value: string | boolean) => {
        updateIssue(value);
    };

    switch (field) {
        case "comments":
            return <InputInline value={issue.comments} onSave={onSave} />;
        case "contactEmails":
            return <InputInline value={issue.contactEmails} onSave={onSave} />;
        case "description":
            return <InputInline value={issue.description} onSave={onSave} />;
        case "actionDescription":
            return <InputInline value={issue.actionDescription} onSave={onSave} />;
        case "azureUrl":
            return <InputInline value={issue.azureUrl} onSave={onSave} />;
        case "followUp":
            return <CheckboxInline value={issue.followUp} onChange={onSave} />;
        case "status":
            return (
                <SelectorInline
                    items={metadata.optionSets.nhwaStatus.options.map(option => {
                        return { id: option.code, label: option.name };
                    })}
                    value={issue.status?.name || ""}
                    onChange={onSave}
                />
            );
        case "action":
            return (
                <SelectorInline
                    items={metadata.optionSets.nhwaAction.options.map(option => {
                        return { id: option.code, label: option.name };
                    })}
                    value={issue.action?.name || ""}
                    onChange={onSave}
                />
            );
        default:
            return null;
    }
});

type EditIssueValueProps = { issue: QualityAnalysisIssue; field: IssuePropertyName };
