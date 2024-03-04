import React from "react";
import i18n from "$/utils/i18n";
import { EmptyState } from "$/webapp/components/empty-state/EmptyState";
import { Typography, Button } from "@material-ui/core";
import { Dropdown } from "@eyeseetea/d2-ui-components";
import styled from "styled-components";
import { useValidationStep } from "./hooks/useValidationStep";

interface PageProps {
    name: string;
}

export const ValidationStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Custom step with some filtering in order to allow some specific checks" } =
        props;
    const { validationItems, value, handleChange, runAnalysis } = useValidationStep();
    return (
        <Container>
            <AnalysisHeader>
                <StyledTypography variant="h2">{i18n.t(name)}</StyledTypography>
                <FiltersContainer>
                    <StyledDropdown
                        key={"validations-filter"}
                        items={validationItems}
                        onChange={handleChange}
                        value={value}
                        label={i18n.t("Validation Rule Group")}
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
