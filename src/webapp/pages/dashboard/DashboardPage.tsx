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
import {
    useAnalysisMethods,
    useGetRows,
    useTableConfig,
} from "$/webapp/hooks/useQualityAnalysisTable";
import { useModules } from "$/webapp/hooks/useModule";
import styled from "styled-components";
import { Module } from "$/domain/entities/Module";
import { Id } from "$/domain/entities/Ref";

type Props = { name: string };

export const DashboardPage: React.FC<Props> = React.memo(props => {
    const { name } = props;
    const [reload, refreshReload] = React.useState(0);
    const [selectedIds, setSelectedIds] = React.useState<Id[]>([]);
    const [filters, setFilters] = React.useState<AnalysisFilterState>(initialFilters);
    const { createQualityAnalysis, removeQualityAnalysis } = useAnalysisMethods({
        onSuccess: () => {
            refreshReload(reload + 1);
        },
        onRemove: () => {
            setSelectedIds([]);
            refreshReload(reload + 1);
        },
    });
    const { tableConfig } = useTableConfig({
        onRemoveQualityAnalysis: React.useCallback(ids => {
            setSelectedIds(ids);
        }, []),
    });
    const { getRows, loading } = useGetRows(filters, reload);
    const modules = useModules();
    const config = useObjectsTable(tableConfig, getRows);

    const onCreateAnalysis = React.useCallback(
        (selectedModule: Module) => {
            createQualityAnalysis(selectedModule, "");
        },
        [createQualityAnalysis]
    );

    const onRemoveAnalysis = React.useCallback(() => {
        removeQualityAnalysis(selectedIds);
    }, [removeQualityAnalysis, selectedIds]);

    const filterComponents = React.useMemo(() => {
        return (
            <AnalysisFilters
                modules={modules}
                initialFilters={filters}
                onChange={setFilters}
                onCreateAnalysis={onCreateAnalysis}
            />
        );
    }, [filters, modules, onCreateAnalysis]);

    return (
        <DashboardContainer>
            <PageHeader title={i18n.t(name)} />
            <ObjectsTable loading={loading} {...config} filterComponents={filterComponents} />
            <ConfirmationDialog
                isOpen={selectedIds.length > 0}
                title={i18n.t("Are you sure you want to delete the selected rows?")}
                onSave={onRemoveAnalysis}
                onCancel={() => setSelectedIds([])}
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
