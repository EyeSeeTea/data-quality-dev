import React from "react";
import i18n from "$/utils/i18n";

import { useNursingMidwiferyStep } from "./useNursingMidwiferyStep";
import { SelectMultiCheckboxes } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";
import { StepAnalysis } from "../StepAnalysis";
import { PageStepProps } from "../../AnalysisPage";

export const NursingMidwiferyStep: React.FC<PageStepProps> = React.memo(props => {
    const { analysis, section, title, updateAnalysis } = props;
    const { disaggregations, selectedDisaggregations, handleChange, reload, runAnalysis } =
        useNursingMidwiferyStep({ analysis, section, updateAnalysis });

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
