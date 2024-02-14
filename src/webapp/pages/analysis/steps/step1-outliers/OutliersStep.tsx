import React from "react";
import i18n from "$/utils/i18n";
import styled from "styled-components";
import { Typography, Button } from "@material-ui/core";
import { Dropdown } from "@eyeseetea/d2-ui-components";
import { useOutliers } from "./useOutliers";
import { EmptyState } from "$/webapp/components/empty-state/EmptyState";

interface PageProps {
    name: string;
}

export const OutliersStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Outliers detection analysis based on DHIS2 min-max standard functionality" } =
        props;
    const { algorithmItems, thresholdItems, valueChange, runAnalysis } = useOutliers();
    return (
        <Container>
            <AnalysisHeader>
                <StyledTypography variant="h2">{i18n.t(name)}</StyledTypography>
                <FiltersContainer>
                    <Dropdown
                        key={"algorithm-filter"}
                        items={algorithmItems}
                        onChange={valueChange}
                        value={"somevalue"}
                        label={i18n.t("Algorithm")}
                    />
                    <Dropdown
                        key={"Threshold-filter"}
                        items={thresholdItems}
                        onChange={valueChange}
                        value={"somevalue"}
                        label={i18n.t("Threshold")}
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
    gap: 8rem;
    margin-block-end: 1.75rem;
`;

const StyledTypography = styled(Typography)`
    font-size: 1.2rem;
    font-weight: 500;
`;

const FiltersContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;
