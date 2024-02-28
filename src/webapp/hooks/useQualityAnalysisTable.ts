import React from "react";
import { GetRows, TableConfig, useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { useAppContext } from "$/webapp/contexts/app-context";
import { analysisColumns } from "$/webapp/utils/analysis";
import { AnalysisFilterState } from "$/webapp/components/analysis-filter/AnalysisFilter";
import {
    ActionType,
    useAnalysisTableActions,
} from "$/webapp/components/analysis-actions/AnalysisActions";
import { Module } from "$/domain/entities/Module";
import { Id } from "$/domain/entities/Ref";

export function useTableConfig(props: UseTableConfigProps) {
    const { onRemoveQualityAnalysis } = props;
    const { actions } = useAnalysisTableActions({
        onDelete: onRemoveQualityAnalysis,
    });

    const tableConfig = React.useMemo<TableConfig<QualityAnalysis>>(() => {
        return {
            actions: actions,
            columns: analysisColumns,
            initialSorting: { field: "name", order: "desc" },
            paginationOptions: { pageSizeOptions: [10, 20, 50], pageSizeInitialValue: 20 },
            searchBoxLabel: i18n.t("Name"),
        };
    }, [actions]);

    return { tableConfig };
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
                            ids: undefined,
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

export function useAnalysisMethods(props: UseAnalysisMethodsProps) {
    const { onSuccess, onRemove } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const createQualityAnalysis = React.useCallback(
        (module: Module, name: string) => {
            loading.show(true, i18n.t("Creating Data Quality..."));
            compositionRoot.qualityAnalysis.create
                .execute({ qualityAnalysis: { module: module, name: name } })
                .run(
                    id => {
                        loading.hide();
                        snackbar.success(i18n.t("Quality Analysis created"));
                        onSuccess(id);
                    },
                    err => {
                        snackbar.error(err.message);
                        loading.hide();
                    }
                );
        },
        [compositionRoot.qualityAnalysis.create, loading, onSuccess, snackbar]
    );

    const removeQualityAnalysis = React.useCallback(
        (selectedIds: Id[]) => {
            loading.show(true, i18n.t("Removing..."));
            compositionRoot.qualityAnalysis.remove.execute(selectedIds).run(
                () => {
                    snackbar.success(i18n.t("Quality Analysis deleted"));
                    loading.hide();
                    onRemove();
                },
                err => {
                    snackbar.error(err.message);
                    loading.hide();
                    onRemove();
                }
            );
        },
        [compositionRoot.qualityAnalysis.remove, loading, onRemove, snackbar]
    );

    const updateStatusQualityAnalysis = React.useCallback(
        (selectedIds: Id[], action: ActionType) => {
            loading.show(true, i18n.t("Updating Status..."));
            const status = action === "inprogress" ? "Completed" : "In Progress";
            compositionRoot.qualityAnalysis.updateStatus.execute(selectedIds, status).run(
                () => {
                    snackbar.success(i18n.t("Quality Analysis updated"));
                    loading.hide();
                    onRemove();
                },
                err => {
                    snackbar.error(err.message);
                    loading.hide();
                    onRemove();
                }
            );
        },
        [compositionRoot.qualityAnalysis.updateStatus, loading, onRemove, snackbar]
    );

    return { createQualityAnalysis, removeQualityAnalysis, updateStatusQualityAnalysis };
}

type UseAnalysisMethodsProps = { onSuccess: (id: Id) => void; onRemove: () => void };
type UseTableConfigProps = { onRemoveQualityAnalysis: (ids: string[], action: ActionType) => void };
