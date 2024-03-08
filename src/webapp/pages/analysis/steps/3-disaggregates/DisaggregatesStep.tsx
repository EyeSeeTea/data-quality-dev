import React from "react";
import i18n from "$/utils/i18n";
import styled from "styled-components";
import { useDisaggregatesStep } from "./hooks/useDisaggregatesStep";
import { EmptyState } from "$/webapp/components/empty-state/EmptyState";
import { Typography, Button } from "@material-ui/core";
import { SelectMultiCheckboxes } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";

interface PageProps {
    name: string;
}

export const DisaggregatesStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Missing disaggregates in selected catcombos" } = props;
    const { dropdownItems, values, handleChange, runAnalysis } = useDisaggregatesStep();

    return (
        <Container>
            <AnalysisHeader>
                <StyledTypography variant="h2">{i18n.t(name)}</StyledTypography>
                <FiltersContainer>
                    <SelectMultiCheckboxes
                        options={dropdownItems}
                        onChange={handleChange}
                        value={values}
                        label={i18n.t("CatCombos")}
                    />
                    <Button variant="contained" color="primary" size="small" onClick={runAnalysis}>
                        {i18n.t("Run")}
                    </Button>
                </FiltersContainer>
            </AnalysisHeader>
            <EmptyState message={i18n.t("Run to get results")} variant={"neutral"} />
        </Container>
    );
});

const Container = styled.section``;

const AnalysisHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 5rem;
    gap: 1rem;
    margin-block-end: 1.75rem;
    flex-wrap: wrap;
`;

const StyledTypography = styled(Typography)`
    font-size: 1.2rem;
    font-weight: 500;
    max-width: 22rem;
`;

const FiltersContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;
