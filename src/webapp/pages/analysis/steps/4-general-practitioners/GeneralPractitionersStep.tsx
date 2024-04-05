import React, { useEffect } from "react";
import { Dropdown, useLoading } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { StepAnalysis } from "$/webapp/pages/analysis/steps/StepAnalysis";

import styled from "styled-components";
import { useGeneralPractitionersStep } from "./useGeneralPractitionersStep";
import { SelectMultiCheckboxes } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";
import { PageStepProps } from "../../AnalysisPage";

export const GeneralPractitionersStep: React.FC<PageStepProps> = React.memo(props => {
    const { analysis, section, title, updateAnalysis } = props;

    const {
        disaggregations,
        doubleCountsList,
        reload,
        runAnalysis,
        selectedDisaggregations,
        threshold,
        handleChange,
        valueChange,
        isLoading,
    } = useGeneralPractitionersStep({
        analysis: analysis,
        section: section,
        updateAnalysis: updateAnalysis,
    });

    const loading = useLoading();

    useEffect(() => {
        if (isLoading) loading.show(isLoading, i18n.t("Running analysis..."));
        else loading.hide();
    }, [isLoading, loading]);

    const onClick = () => {
        runAnalysis();
    };

    return (
        <div>
            <StepAnalysis
                id={analysis.id}
                onRun={onClick}
                reload={reload}
                section={section}
                title={title}
            >
                <SelectMultiCheckboxes
                    options={disaggregations}
                    label={i18n.t("Disaggregations")}
                    value={selectedDisaggregations}
                    onChange={handleChange}
                />
                <StyledDropdown
                    hideEmpty
                    key={"double-counts-filter"}
                    items={doubleCountsList}
                    onChange={valueChange}
                    value={threshold}
                    label={i18n.t("Double Counts Threshold")}
                />
            </StepAnalysis>
        </div>
    );
});

const StyledDropdown = styled(Dropdown)`
    min-width: 14rem;
`;
