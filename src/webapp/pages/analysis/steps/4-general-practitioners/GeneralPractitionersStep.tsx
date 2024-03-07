import React from "react";
import i18n from "$/utils/i18n";
import styled from "styled-components";
import { MultipleDropdown } from "@eyeseetea/d2-ui-components";
import { useGeneralPractitionersStep } from "./useGeneralPractitionersStep";
import { EmptyState } from "$/webapp/components/empty-state/EmptyState";
import { Typography, Button } from "@material-ui/core";
import { Dropdown } from "@eyeseetea/d2-ui-components";

interface PageProps {
    name: string;
}

export const GeneralPractitionersStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Personnel analysis: General Practitioners missing and double counts" } = props;
    const { doubleCountsList, values, handleChange, runAnalysis, valueChange, catCombosList } =
        useGeneralPractitionersStep();

    return (
        <Container>
            <AnalysisHeader>
                <StyledTypography variant="h2">{i18n.t(name)}</StyledTypography>
                <FiltersContainer>
                    <StyledMultipleDropdown
                        items={catCombosList}
                        label={i18n.t("CatCombos")}
                        values={values}
                        onChange={handleChange}
                    />
                    <StyledDropdown
                        hideEmpty
                        key={"double-counts-filter"}
                        items={doubleCountsList}
                        onChange={valueChange}
                        value={"somevalue"}
                        label={i18n.t("Double Counts Threshold")}
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

const StyledDropdown = styled(Dropdown)`
    min-width: 14rem;
`;
const StyledMultipleDropdown = styled(MultipleDropdown)`
    max-width: 20rem;
`;