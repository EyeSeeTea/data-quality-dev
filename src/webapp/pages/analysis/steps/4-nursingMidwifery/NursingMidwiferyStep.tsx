import React from "react";
import i18n from "$/utils/i18n";

import { useNursingMidwiferyStep } from "./useNursingMidwiferyStep";
import { SelectMultiCheckboxes } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";
import { StepAnalysis } from "../StepAnalysis";
import { PageStepProps } from "../../AnalysisPage";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";

export const NursingMidwiferyStep: React.FC<PageStepProps> = React.memo(props => {
    const { analysis, section, title, updateAnalysis } = props;
    const {
        disaggregations,
        selectedDisaggregations,
        handleChange,
        reload,
        runAnalysis,
        isLoading,
        error,
    } = useNursingMidwiferyStep({ analysis, section, updateAnalysis });
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
            onRun={runAnalysis}
        >
            <SelectMultiCheckboxes
                options={disaggregations}
                onChange={handleChange}
                value={selectedDisaggregations}
                label={i18n.t("CatCombos")}
            />
        </StepAnalysis>
    );
});
