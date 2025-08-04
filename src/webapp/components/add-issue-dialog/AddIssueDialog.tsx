import React from "react";
import {
    ConfirmationDialog,
    Dropdown,
    MultipleDropdown,
    OrgUnitsSelector,
} from "@eyeseetea/d2-ui-components";
import styled from "styled-components";
import { TextField } from "@material-ui/core";

import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { useAddIssueDialog } from "$/webapp/components/add-issue-dialog/useAddIssueDialog";
import { Maybe } from "$/utils/ts-utils";
import i18n from "$/utils/i18n";
import { IssueTemplate } from "$/domain/usecases/CreateIssueUseCase";

export type AddIssueDialogProps = {
    onAddIssue: (issues: IssueTemplate[]) => void;
    onClose: () => void;
    analysis: QualityAnalysis;
};

export const AddIssueDialog: React.FC<AddIssueDialogProps> = props => {
    const { onAddIssue, onClose, analysis } = props;

    const { api, currentUser } = useAppContext();
    const {
        addIssueForm,
        updateForm,
        dataElementOptions,
        categoryOptionOptions,
        periodOptions,
        onSave,
        issuesToAddCount,
    } = useAddIssueDialog({ analysis, onAddIssue });

    const onUpdateDataElement = React.useCallback(
        (value: Maybe<string>) =>
            updateForm("dataElementId")(value !== undefined ? [value] : value),
        [updateForm]
    );

    const onUpdateDescription = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => updateForm("description")([ev.target.value]),
        [updateForm]
    );

    const disableCategoryOptions = !addIssueForm.dataElementId;
    const disableSave = issuesToAddCount <= 0 || !addIssueForm.description;
    const saveText = i18n.t("Add Issues ({{count}})", { count: issuesToAddCount });

    return (
        <ConfirmationDialog
            isOpen
            title={i18n.t("Add Issue")}
            saveText={saveText}
            onSave={onSave}
            onCancel={onClose}
            maxWidth={"lg"}
            fullWidth
            disableSave={disableSave}
        >
            <FormControlsContainer>
                <StyledTextField
                    value={addIssueForm.description}
                    onChange={onUpdateDescription}
                    label={i18n.t("Description")}
                    multiline={true}
                    minRows={3}
                    variant="outlined"
                    required
                />
                <FieldWrapper>
                    <StyledMultipleDropdown
                        items={periodOptions}
                        onChange={updateForm("periods")}
                        values={addIssueForm.periods}
                        label={i18n.t("Periods")}
                    />
                </FieldWrapper>
                <FieldWrapper>
                    <StyledDropdown
                        items={dataElementOptions}
                        onChange={onUpdateDataElement}
                        value={addIssueForm.dataElementId}
                        label={i18n.t("Data Element")}
                    />
                </FieldWrapper>
                <FieldWrapper>
                    <Field $disabled={disableCategoryOptions}>
                        <StyledMultipleDropdown
                            items={categoryOptionOptions}
                            onChange={updateForm("categoryOptionIds")}
                            values={addIssueForm.categoryOptionIds}
                            label={i18n.t("Category Options")}
                        />
                    </Field>
                </FieldWrapper>
            </FormControlsContainer>
            <OrgUnitsSelector
                api={api}
                onChange={updateForm("orgUnitPaths")}
                selected={addIssueForm.orgUnitPaths}
                levels={[1, 2, 3]}
                selectableLevels={[2, 3]}
                rootIds={currentUser.countries.map(country => country.id)}
                withElevation={false}
                selectableIds={analysis.countriesAnalysis}
            />
        </ConfirmationDialog>
    );
};

const FormControlsContainer = styled.div`
    display: flex;
    gap: 1.5rem;
    width: 100%;
    margin-block-end: 1.25rem;
    flex-wrap: wrap;
    flex-direction: column;
`;

const FieldWrapper = styled.div`
    display: flex;
    gap: 1rem;
`;

const StyledMultipleDropdown = styled(MultipleDropdown)`
    width: 50%;
`;

const StyledDropdown = styled(Dropdown)`
    width: 50%;
`;

const StyledTextField = styled(TextField)`
    width: 100%;
`;

const Field = styled.div<{ $disabled?: boolean }>`
    pointer-events: ${props => (props.$disabled ? "none" : "auto")};
    opacity: ${props => (props.$disabled ? "0.7" : "1")};
    width: 100%;
`;
