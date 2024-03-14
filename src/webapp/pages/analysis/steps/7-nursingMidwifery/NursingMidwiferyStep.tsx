import React from "react";
import i18n from "$/utils/i18n";
import styled from "styled-components";
import { useNursingMidwiferyStep } from "./useNursingMidwiferyStep";
import { SelectMultiCheckboxes } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";
import { useParams } from "react-router-dom";
import { StepAnalysis } from "../StepAnalysis";
import { missingNursing } from "../../steps";

interface PageProps {
    name: string;
}

export const NursingMidwiferyStep: React.FC<PageProps> = React.memo(() => {
    const { id } = useParams<{ id: string }>();
    const {
        analysis,
        disaggregations,
        selectedDisaggregations,
        handleChange,
        reload,
        runAnalysis,
    } = useNursingMidwiferyStep({ analysisId: id });
    const section = analysis?.sections.find(section => section.name === missingNursing);

    if (!analysis || !section) return null;

    return (
        <Container>
            <StepAnalysis
                id={analysis.id}
                section={section}
                reload={reload}
                title={i18n.t("Missing nursing personnel when midwifery personnel is present")}
                onRun={runAnalysis}
            >
                <FiltersContainer>
                    <SelectMultiCheckboxes
                        options={disaggregations}
                        onChange={handleChange}
                        value={selectedDisaggregations}
                        label={i18n.t("CatCombos")}
                    />
                </FiltersContainer>
            </StepAnalysis>
        </Container>
    );
});

const Container = styled.section``;

const FiltersContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;
