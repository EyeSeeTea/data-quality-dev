import React from "react";
import { ObjectsTable, useObjectsTable } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";
import {
    AnalysisFilterState,
    AnalysisFilters,
    initialFilters,
} from "$/webapp/components/analysis-filter/AnalysisFilter";
import { useGetRows, useTableConfig } from "$/webapp/hooks/useQualityAnalysisTable";
import { useModules } from "$/webapp/hooks/useModule";
import styled from "styled-components";

type Props = { name: string };

export const DashboardPage: React.FC<Props> = React.memo(props => {
    const { name } = props;
    const [filters, setFilters] = React.useState<AnalysisFilterState>(initialFilters);

    const modules = useModules();
    const { isDialogOpen, onDelete, setIsDialogOpen, tableConfig } = useTableConfig();
    const { getRows, loading } = useGetRows(filters);
    const config = useObjectsTable(tableConfig, getRows);

    const filterComponents = React.useMemo(() => {
        return <AnalysisFilters modules={modules} initialFilters={filters} onChange={setFilters} />;
    }, [filters, modules]);

    return (
        <DashboardContainer>
            <PageHeader title={i18n.t(name)} />
            <ObjectsTable loading={loading} {...config} filterComponents={filterComponents} />
            <ConfirmationDialog
                isOpen={isDialogOpen}
                title={i18n.t("Are you sure you want to delete this?")}
                onSave={onDelete}
                onCancel={() => setIsDialogOpen(false)}
                saveText={i18n.t("Yes, Delete")}
                cancelText={i18n.t("Cancel")}
                fullWidth={true}
                disableEnforceFocus
            />
        </DashboardContainer>
    );
});

const DashboardContainer = styled.div`
    padding: 1em;
`;
