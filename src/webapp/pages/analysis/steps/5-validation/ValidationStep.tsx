import React from "react";
import i18n from "$/utils/i18n";
import { Dropdown, useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import styled from "styled-components";
import { useValidationStep } from "./useValidationStep";
import { PageStepProps } from "../../AnalysisPage";
import { StepAnalysis } from "../StepAnalysis";

export const ValidationStep: React.FC<PageStepProps> = React.memo(props => {
    const { analysis, section, title, updateAnalysis } = props;
    const {
        validationRules,
        handleChange,
        runAnalysis,
        reload,
        selectedValidationRule,
        isLoading,
        error,
    } = useValidationStep({ analysis, section, updateAnalysis });
    const loading = useLoading();
    const snackbar = useSnackbar();

    React.useEffect(() => {
        if (isLoading) loading.show(isLoading, i18n.t("Running analysis..."));
        else loading.hide();
    }, [isLoading, loading]);

    React.useEffect(() => {
        if (error) snackbar.error(error);
    }, [error, snackbar]);

    return (
        <StepAnalysis
            id={analysis.id}
            section={section}
            reload={reload}
            title={title}
            onRun={() => runAnalysis()}
        >
            <StyledDropdown
                hideEmpty
                items={validationRules}
                onChange={handleChange}
                value={selectedValidationRule}
                label={i18n.t("Validation Rule Group")}
            />
        </StepAnalysis>
    );
});

const StyledDropdown = styled(Dropdown)`
    min-width: 14rem;
`;
