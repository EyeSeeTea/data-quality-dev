import React from "react";
import { useParams } from "react-router-dom";
import { Dropdown, MultipleDropdown } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { StepAnalysis } from "$/webapp/pages/analysis/steps/StepAnalysis";
import { practitionersKey } from "$/webapp/pages/analysis/steps";

import styled from "styled-components";
import { useGeneralPractitionersStep } from "./useGeneralPractitionersStep";

interface PageProps {
    name: string;
}

export const GeneralPractitionersStep: React.FC<PageProps> = React.memo(() => {
    const { id } = useParams<{ id: string }>();

    const {
        analysis,
        disaggregations,
        doubleCountsList,
        reload,
        runAnalysis,
        selectedDisaggregations,
        threshold,
        handleChange,
        valueChange,
    } = useGeneralPractitionersStep({ analysisId: id });
    const section = analysis?.sections.find(section => section.name === practitionersKey);

    const onClick = () => {
        runAnalysis();
    };

    if (!analysis?.id || !section) return null;

    return (
        <div>
            <StepAnalysis
                id={analysis.id}
                onRun={onClick}
                reload={reload}
                section={section}
                title={i18n.t(
                    "Medical doctors analysis: General Practicioners missing and double counts"
                )}
            >
                <StyledMultipleDropdown
                    items={disaggregations}
                    label={i18n.t("Disaggregations")}
                    values={selectedDisaggregations}
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
const StyledMultipleDropdown = styled(MultipleDropdown)`
    max-width: 20rem;
`;
