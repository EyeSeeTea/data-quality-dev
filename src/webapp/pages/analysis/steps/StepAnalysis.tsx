import React from "react";
import { Button, Typography } from "@material-ui/core";
import { ObjectsTable, useObjectsTable } from "@eyeseetea/d2-ui-components";
import styled from "styled-components";

import i18n from "$/utils/i18n";
import { Id } from "$/domain/entities/Ref";
import { EmptyState } from "$/webapp/components/empty-state/EmptyState";
import { useGetRows, useTableConfig } from "$/webapp/components/issues/IssueTable";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { IssueFilters } from "$/webapp/components/issues/IssueFilters";
import { initialFilters } from "$/webapp/utils/issues";

export const StepAnalysis: React.FC<StepContainerProps> = React.memo(props => {
    const { children, id, onRun, reload, section, title } = props;

    const [filters, setFilters] = React.useState(initialFilters);

    const { tableConfig, refresh } = useTableConfig();
    const { getRows, loading } = useGetRows(filters, reload, id, section.id, refresh);
    const config = useObjectsTable(tableConfig, getRows);

    const isPending = section.status === "pending";

    const filterComponents = React.useMemo(() => {
        return <IssueFilters initialFilters={filters} onChange={setFilters} />;
    }, [filters]);

    return (
        <Container>
            <>
                <AnalysisHeader>
                    <StyledTypography variant="h2">{title}</StyledTypography>
                    {isPending && (
                        <FiltersContainer>
                            {children}
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => onRun()}
                            >
                                {i18n.t("Run")}
                            </Button>
                        </FiltersContainer>
                    )}
                </AnalysisHeader>
                {isPending && (
                    <EmptyState message={i18n.t("Run to get results")} variant="neutral" />
                )}
                {section.status === "success" && (
                    <EmptyState message={i18n.t("No Issues found")} variant="success" />
                )}
            </>
            {section.status === "success_with_issues" && (
                <ObjectsTable loading={loading} {...config} filterComponents={filterComponents} />
            )}
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

type StepContainerProps = {
    id: Id;
    children?: React.ReactNode;
    reload: number;
    section: QualityAnalysisSection;
    title: string;
    onRun: () => void;
};
