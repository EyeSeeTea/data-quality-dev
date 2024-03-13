import React from "react";
import i18n from "$/utils/i18n";
import styled from "styled-components";
import { useDisaggregatesStep } from "./useDisaggregatesStep";
import { SelectMultiCheckboxes } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";
import { StepAnalysis } from "../StepAnalysis";
import { useParams } from "react-router-dom";
import { disaggregateKey } from "../../steps";

export const DisaggregatesStep: React.FC<PageProps> = React.memo(() => {
    const { id } = useParams<{ id: string }>();

    const { analysis, disaggregations, handleChange, reload, runAnalysis, selectedDisagregations } =
        useDisaggregatesStep({
            analysisId: id,
        });
    const section = analysis?.sections.find(section => section.name === disaggregateKey);
    if (!analysis?.id || !section) return null;

    const onClick = () => {
        runAnalysis();
    };

    return (
        <StepAnalysis
            id={analysis.id}
            onRun={onClick}
            reload={reload}
            section={section}
            title={i18n.t("Missing disaggregates in selected catcombos")}
        >
            <FiltersContainer>
                <SelectMultiCheckboxes
                    options={disaggregations}
                    onChange={handleChange}
                    value={selectedDisagregations}
                    label={i18n.t("CatCombos")}
                />
            </FiltersContainer>
        </StepAnalysis>
    );
});

const FiltersContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

type PageProps = { name: string };
