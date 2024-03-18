import React, { useState } from "react";
import i18n from "$/utils/i18n";
import { Typography } from "@material-ui/core";
import { ObjectsTable, useObjectsTable } from "@eyeseetea/d2-ui-components";
import { useAnalysisById } from "$/webapp/hooks/useAnalysis";
import { useGetRows, useTableConfig } from "$/webapp/components/issues/AllIssuesTable";
import { initialFilters } from "$/webapp/utils/issues";
import { GetIssuesOptions } from "$/domain/repositories/IssueRepository";
import { useParams } from "react-router-dom";
import styled from "styled-components";
interface PageProps {
    name: string;
}

export const SummaryStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Summary" } = props;
    const params = useParams<{ id: string }>();
    const { tableConfig } = useTableConfig();
    const [reload, refreshReload] = useState(0);
    const { analysis, setAnalysis } = useAnalysisById({ id: params.id });
    const section = analysis?.sections.find(section => section.name === "Summary");
    const [filters, _] = React.useState<GetIssuesOptions["filters"]>(initialFilters);

    const { getRows, loading } = useGetRows(filters, reload, params.id, section?.id || "");
    const config = useObjectsTable(tableConfig, getRows);

    return (
        <Container>
            <AnalysisHeader>
                <StyledTypography variant="h2">{i18n.t(name)}</StyledTypography>
            </AnalysisHeader>
            <ObjectsTable loading={loading} {...config} />
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
