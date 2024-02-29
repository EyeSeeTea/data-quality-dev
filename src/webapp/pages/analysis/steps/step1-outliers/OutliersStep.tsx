import React from "react";
import i18n from "$/utils/i18n";
import styled from "styled-components";
import { Typography, Button } from "@material-ui/core";
import { Dropdown, ObjectsTable, useObjectsTable } from "@eyeseetea/d2-ui-components";
import { EmptyState } from "$/webapp/components/empty-state/EmptyState";
import { useParams } from "react-router-dom";
import { useGetRows, useTableConfig } from "$/webapp/components/issues/IssueTable";
import { GetIssuesOptions } from "$/domain/repositories/IssueRepository";
import { initialFilters } from "$/webapp/utils/issues";
import { useAnalysisById } from "$/webapp/hooks/useAnalysis";
import { algorithmList, thresholdList, useAnalysisOutlier } from "./useOutliers";
import { Maybe } from "$/utils/ts-utils";
import { outlierKey } from "../../steps";

const defaultOutlierParams = { algorithm: "Z_SCORE", threshold: "3" };

export const OutliersStep: React.FC<PageProps> = React.memo(() => {
    const params = useParams<{ id: string }>();
    const [reload, refreshReload] = React.useState(0);
    const [qualityFilters, setQualityFilters] = React.useState(defaultOutlierParams);
    const [filters, _] = React.useState<GetIssuesOptions["filters"]>(initialFilters);

    const { tableConfig } = useTableConfig();
    const { analysis, setAnalysis } = useAnalysisById({ id: params.id });

    const section = analysis?.sections.find(section => section.name === outlierKey);

    const { getRows, loading } = useGetRows(filters, reload, params.id, section?.id || "");
    const config = useObjectsTable(tableConfig, getRows);
    const { runAnalysisOutlier } = useAnalysisOutlier({
        onSucess: qualityAnalysis => {
            refreshReload(reload + 1);
            setAnalysis(qualityAnalysis);
        },
    });

    const runAnalysis = () => {
        runAnalysisOutlier(qualityFilters.algorithm, params.id, qualityFilters.threshold);
    };

    const onFilterChange = React.useCallback<
        (value: Maybe<string>, filterAttribute: string) => void
    >((value, filterAttribute) => {
        setQualityFilters(prev => ({ ...prev, [filterAttribute]: value }));
    }, []);

    const isPending = section?.status === "pending";

    return (
        <Container>
            <>
                <AnalysisHeader>
                    <StyledTypography variant="h2">
                        {i18n.t(
                            "Outliers detection analysis based on DHIS2 min-max standard functionality"
                        )}
                    </StyledTypography>
                    {isPending && (
                        <FiltersContainer>
                            <Dropdown
                                hideEmpty
                                items={algorithmList}
                                onChange={value => onFilterChange(value, "algorithm")}
                                value={qualityFilters.algorithm}
                                label={i18n.t("Algorithm")}
                            />
                            <Dropdown
                                hideEmpty
                                items={thresholdList}
                                onChange={value => onFilterChange(value, "threshold")}
                                value={qualityFilters.threshold}
                                label={i18n.t("Threshold")}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => runAnalysis()}
                            >
                                {i18n.t("Run")}
                            </Button>
                        </FiltersContainer>
                    )}
                </AnalysisHeader>
                {isPending && (
                    <EmptyState message={i18n.t("Run to get results")} variant="neutral" />
                )}
                {section?.status === "success" && (
                    <EmptyState message={i18n.t("No Issues found")} variant="success" />
                )}
            </>

            {config.rows.length > 0 && <ObjectsTable loading={loading} {...config} />}
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

interface PageProps {
    name: string;
}
