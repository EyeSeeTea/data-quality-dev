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
import { ORG_UNIT_LEVELS, ORG_UNIT_SELECTABLE_LEVELS } from "$/webapp/utils/form";
import { Ref } from "$/domain/entities/Ref";

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

    const [loadedSelectableCountries, setLoadedSelectableCountries] = React.useState<string[]>([]);

    const onUpdateDataElement = React.useCallback(
        (value: Maybe<string>) =>
            updateForm("dataElementId")(value !== undefined ? [value] : value),
        [updateForm]
    );

    const onUpdateDescription = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => updateForm("description")([ev.target.value]),
        [updateForm]
    );

    const selectableCountries = React.useMemo(
        () => [...analysis.countriesAnalysis, ...loadedSelectableCountries],
        [analysis, loadedSelectableCountries]
    );

    const addChildrenOuToSelectable = React.useCallback(
        (children: OrgUnit[]) => {
            //all children have the same parent
            const parent = children[0]?.parent;
            if (parent && parent.id && analysis.countriesAnalysis.includes(parent.id)) {
                const childrenIds = children.map(child => child.id);
                setLoadedSelectableCountries(prev => [...prev, ...childrenIds]);
            }
        },
        [analysis]
    );

    const disableCategoryOptions = !addIssueForm.dataElementId;
    const disableSave = issuesToAddCount <= 0 || !addIssueForm.description.trim();
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
                levels={ORG_UNIT_LEVELS}
                selectableLevels={ORG_UNIT_SELECTABLE_LEVELS}
                rootIds={currentUser.countries.map(country => country.id)}
                withElevation={false}
                selectableIds={selectableCountries}
                onChildrenLoaded={{
                    fn: addChildrenOuToSelectable,
                }}
            />
        </ConfirmationDialog>
    );
};

type OrgUnit = { parent: Ref; id: string };

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
