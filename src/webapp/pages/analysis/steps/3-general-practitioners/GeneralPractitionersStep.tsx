import React from "react";
import { Dropdown } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { StepAnalysis } from "$/webapp/pages/analysis/steps/StepAnalysis";

import styled from "styled-components";
import { useGeneralPractitionersStep } from "./useGeneralPractitionersStep";
import { SelectMultiCheckboxes } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";
import { PageStepProps } from "../../AnalysisPage";
import { EmptyState } from "$/webapp/components/empty-state/EmptyState";
import { Typography } from "@material-ui/core";

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
    } = useGeneralPractitionersStep({
        analysis: analysis,
        section: section,
        updateAnalysis: updateAnalysis,
    });

    const onClick = () => {
        runAnalysis();
    };

    return analysis.module.name !== "NHWA Module 2" ? (
        <>
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
        </>
    ) : (
        <>
            <AnalysisHeader>
                <StyledTypography variant="h2">{title}</StyledTypography>
            </AnalysisHeader>
            <EmptyState
                message={i18n.t("The selected step is not available for the selected module")}
                variant={"neutral"}
            />
        </>
    );
});

const StyledDropdown = styled(Dropdown)`
    min-width: 14rem;
`;

const AnalysisHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 5rem;
    gap: 8rem;
    margin-block-end: 1.75rem;
`;

const StyledTypography = styled(Typography)`
    font-size: 1.2rem;
    font-weight: 500;
`;
