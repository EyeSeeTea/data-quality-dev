import React from "react";
import { GetRows, TableConfig } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { useAppContext } from "$/webapp/contexts/app-context";
import { analysisColumns } from "$/webapp/utils/analysis";
import { AnalysisFilterState } from "$/webapp/components/analysis-filter/AnalysisFilter";
import { useAnalysisActions } from "$/webapp/components/analysis-actions/AnalysisActions";

export function useTableConfig() {
    const { actions, isDialogOpen, setIsDialogOpen } = useAnalysisActions({
        statusIsCompleted: false,
    });

    const onDelete = () => {
        setIsDialogOpen(false);
    };

    const tableConfig = React.useMemo<TableConfig<QualityAnalysis>>(() => {
        return {
            actions: actions,
            columns: analysisColumns,
            initialSorting: { field: "name", order: "asc" },
            paginationOptions: { pageSizeOptions: [10, 20, 50], pageSizeInitialValue: 20 },
            searchBoxLabel: i18n.t("Name"),
        };
    }, [actions]);

    return { isDialogOpen, onDelete, setIsDialogOpen, tableConfig };
}

export function useGetRows(filters: AnalysisFilterState) {
    const { compositionRoot } = useAppContext();
    const [loading, setLoading] = React.useState(false);
    const getRows = React.useCallback<GetRows<QualityAnalysis>>(
        (search, pagination, sorting) => {
            return new Promise((resolve, reject) => {
                setLoading(true);
                return compositionRoot.qualityAnalysis.get
                    .execute({
                        pagination: { page: pagination.page, pageSize: pagination.pageSize },
                        sorting: { field: sorting.field, order: sorting.order },
                        filters: {
                            name: search,
                            endDate: filters.endDate,
                            startDate: filters.startDate,
                            status: filters.status,
                            module: filters.module,
                        },
                    })
                    .run(
                        qualityAnalysis => {
                            setLoading(false);
                            resolve({
                                pager: qualityAnalysis.pagination,
                                objects: qualityAnalysis.rows,
                            });
                        },
                        err => {
                            setLoading(false);
                            reject(new Error(err.message));
                        }
                    );
            });
        },
        [
            compositionRoot.qualityAnalysis.get,
            filters.endDate,
            filters.module,
            filters.startDate,
            filters.status,
        ]
    );

    return { getRows, loading };
}
