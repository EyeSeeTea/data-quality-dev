import React from "react";
import {
    ConfirmationDialog,
    Dropdown,
    MultipleDropdown,
    OrgUnitsSelector,
} from "@eyeseetea/d2-ui-components";
import styled from "styled-components";

import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { useAddIssueDialog } from "$/webapp/components/add-issue-dialog/useAddIssueDialog";
import { Maybe } from "$/utils/ts-utils";

export type AddIssueDialogProps = {
    onAddIssue: (issues: QualityAnalysisIssue[]) => void;
    onClose: () => void;
    analysis: QualityAnalysis;
};

export const AddIssueDialog: React.FC<AddIssueDialogProps> = props => {
    const { onAddIssue, onClose, analysis } = props;

    console.log(analysis);

    const { api, currentUser } = useAppContext();
    const { addIssueForm, updateForm, dataElementOptions, categoryOptionOptions, periodOptions } =
        useAddIssueDialog({ analysis });

    const onSave = React.useCallback(() => {
        onAddIssue([]);
    }, [onAddIssue]);

    const onUpdateDataElement = React.useCallback(
        (value: Maybe<string>) => updateForm("dataElement")(value !== undefined ? [value] : value),
        [updateForm]
    );

    const disableCategoryOptions = !addIssueForm.dataElement;

    return (
        <ConfirmationDialog
            isOpen
            title={"Add Issue"}
            onSave={onSave}
            onCancel={onClose}
            maxWidth={"lg"}
            fullWidth
        >
            <FormControlsContainer>
                <FormWrapper>
                    <Dropdown
                        items={dataElementOptions}
                        onChange={onUpdateDataElement}
                        value={addIssueForm.dataElement}
                        label={"Data Element"}
                    />
                    <Field $disabled={disableCategoryOptions}>
                        <MultipleDropdown
                            items={categoryOptionOptions}
                            onChange={updateForm("categoryOptions")}
                            values={addIssueForm.categoryOptions}
                            label={"Category Options"}
                        />
                    </Field>
                    <MultipleDropdown
                        items={periodOptions}
                        onChange={updateForm("periods")}
                        values={addIssueForm.periods}
                        label={"Periods"}
                    />
                </FormWrapper>
            </FormControlsContainer>
            <OrgUnitsSelector
                api={api}
                onChange={updateForm("orgUnits")}
                selected={addIssueForm.orgUnits}
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
    align-items: center;
    justify-content: space-between;
    margin-block-end: 1.25rem;
    flex-wrap: wrap;
`;

const FormWrapper = styled.div`
    display: flex;
    gap: 1rem;
`;

const Field = styled.div<{ $disabled?: boolean }>`
    pointer-events: ${props => (props.$disabled ? "none" : "auto")};
    opacity: ${props => (props.$disabled ? "0.7" : "1")};
`;
