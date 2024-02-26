import React from "react";
import { GetRows, TableConfig, useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { useAppContext } from "$/webapp/contexts/app-context";
import { analysisColumns } from "$/webapp/utils/analysis";
import { AnalysisFilterState } from "$/webapp/components/analysis-filter/AnalysisFilter";
import { useAnalysisActions } from "$/webapp/components/analysis-actions/AnalysisActions";
import { Module } from "$/domain/entities/Module";

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
            initialSorting: { field: "name", order: "desc" },
            paginationOptions: { pageSizeOptions: [10, 20, 50], pageSizeInitialValue: 20 },
            searchBoxLabel: i18n.t("Name"),
        };
    }, [actions]);

    return { isDialogOpen, onDelete, setIsDialogOpen, tableConfig };
}

export function useGetRows(filters: AnalysisFilterState, reloadKey: number) {
    const { compositionRoot } = useAppContext();
    const [loading, setLoading] = React.useState(false);
    const getRows = React.useCallback<GetRows<QualityAnalysis>>(
        (search, pagination, sorting) => {
            console.debug(reloadKey);
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
            reloadKey,
        ]
    );

    return { getRows, loading };
}

export function useCreateQualityAnalysis(props: UseCreateQualityAnalysisProps) {
    const { onSuccess } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const createQualityAnalysis = React.useCallback(
        (module: Module, name: string) => {
            loading.show();
            compositionRoot.qualityAnalysis.create
                .execute({ qualityAnalysis: { module: module, name: name } })
                .run(
                    () => {
                        loading.hide();
                        snackbar.success(i18n.t("Quality Analysis created"));
                        onSuccess();
                    },
                    err => {
                        snackbar.error(err.message);
                        loading.hide();
                    }
                );
        },
        [compositionRoot.qualityAnalysis.create, loading, onSuccess, snackbar]
    );

    return createQualityAnalysis;
}

type UseCreateQualityAnalysisProps = { onSuccess: () => void };
