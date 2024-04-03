import React from "react";
import {
    GetRows,
    ObjectsTable,
    TableConfig,
    useLoading,
    useObjectsTable,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";

import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { GetIssuesOptions } from "$/domain/repositories/IssueRepository";
import i18n from "$/utils/i18n";
import { Id } from "$/domain/entities/Ref";
import { EditIssueValue } from "./EditIssueValue";
import { IssueFilters } from "./IssueFilters";
import { initialFilters } from "$/webapp/utils/issues";
import { Maybe } from "$/utils/ts-utils";
import CloudDownload from "@material-ui/icons/CloudDownload";

export function useCopyContactEmails(props: UseCopyContactEmailsProps) {
    const { onSuccess } = props;
    const { compositionRoot } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();

    const copyContactEmails = React.useCallback(
        (
            issueId: Id,
            analysisId: Id,
            sectionId: Maybe<Id>,
            filters: GetIssuesOptions["filters"]
        ) => {
            loading.show(true, i18n.t("Copying Contact Emails and marking for Follow-Up"));
            compositionRoot.issues.copyEmails
                .execute({
                    analysisId: analysisId,
                    sectionId: sectionId,
                    issueId: issueId,
                    filters,
                })
                .run(
                    () => {
                        snackbar.success(i18n.t("Contact emails copied"));
                        loading.hide();
                        if (onSuccess) onSuccess();
                    },
                    error => {
                        snackbar.error(error.message);
                        loading.hide();
                    }
                );
        },
        [compositionRoot.issues.copyEmails, loading, snackbar, onSuccess]
    );

    return copyContactEmails;
}

export function useExportIssues() {
    const { compositionRoot } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();

    const exportIssues = React.useCallback(
        (analysisId: Id, filters: GetIssuesOptions["filters"]) => {
            loading.show(true, i18n.t("Exporting Issues..."));
            compositionRoot.issues.export.execute({ analysisId: analysisId, filters }).run(
                () => {
                    snackbar.success(i18n.t("Issues exported"));
                    loading.hide();
                },
                error => {
                    snackbar.error(error.message);
                    loading.hide();
                }
            );
        },
        [compositionRoot.issues.export, loading, snackbar]
    );

    return exportIssues;
}

export function useTableConfig(props: UseTableConfigProps) {
    const { analysisId, filters, sectionId, showExport } = props;
    const [refresh, setRefresh] = React.useState(0);

    const onSuccess = React.useCallback(() => {
        setRefresh(value => value + 1);
    }, [setRefresh]);

    const copyContactEmails = useCopyContactEmails({ onSuccess: onSuccess });
    const exportIssues = useExportIssues();

    const tableConfig = React.useMemo<TableConfig<QualityAnalysisIssue>>(() => {
        return {
            globalActions: showExport
                ? [
                      {
                          icon: <CloudDownload />,
                          name: "Export",
                          text: i18n.t("Export"),
                          onClick: () => {
                              exportIssues(analysisId, filters);
                          },
                      },
                  ]
                : undefined,
            actions: [
                {
                    name: "Extend Contact Emails",
                    text: i18n.t("Extend Follow-Up + Contact Emails"),
                    primary: false,
                    onClick(selectedIds) {
                        const issueId = selectedIds[0];
                        if (!issueId) return false;
                        copyContactEmails(issueId, analysisId, sectionId, filters);
                    },
                },
            ],
            columns: [
                { name: "number", text: i18n.t("Issue"), sortable: true },
                { name: "country", text: i18n.t("Country"), sortable: false },
                { name: "period", text: i18n.t("Period"), sortable: false },
                { name: "dataElement", text: i18n.t("Data Element"), sortable: false },
                {
                    name: "categoryOption",
                    text: i18n.t("Category"),
                    sortable: false,
                },
                {
                    name: "description",
                    text: i18n.t("Description"),
                    sortable: false,
                },
                {
                    name: "status",
                    text: i18n.t("Status"),
                    sortable: false,
                    getValue: value => {
                        return <EditIssueValue key={value.id} field="status" issue={value} />;
                    },
                },
                {
                    name: "azureUrl",
                    text: i18n.t("Azure URL"),
                    sortable: false,
                    hidden: true,
                    getValue: value => {
                        return (
                            <EditIssueValue
                                key={value.id}
                                field="azureUrl"
                                issue={value}
                                setRefresh={setRefresh}
                            />
                        );
                    },
                },
                {
                    name: "followUp",
                    text: i18n.t("Follow Up"),
                    sortable: false,
                    getValue: value => (
                        <EditIssueValue
                            key={value.id}
                            field="followUp"
                            issue={value}
                            setRefresh={setRefresh}
                        />
                    ),
                },
                {
                    name: "action",
                    text: i18n.t("Action"),
                    sortable: false,
                    getValue: value => {
                        return <EditIssueValue key={value.id} field="action" issue={value} />;
                    },
                },
                {
                    name: "contactEmails",
                    text: i18n.t("Contact Emails"),
                    sortable: false,
                    getValue: value => {
                        return (
                            <EditIssueValue key={value.id} field="contactEmails" issue={value} />
                        );
                    },
                },
                {
                    name: "actionDescription",
                    text: i18n.t("Action Description"),
                    sortable: false,
                    hidden: true,
                    getValue: value => {
                        return (
                            <EditIssueValue
                                key={value.id}
                                field="actionDescription"
                                issue={value}
                            />
                        );
                    },
                },
                {
                    name: "comments",
                    text: i18n.t("Comments"),
                    sortable: false,
                    hidden: true,
                    getValue: value => {
                        return <EditIssueValue key={value.id} field="comments" issue={value} />;
                    },
                },
            ],
            initialSorting: { field: "number", order: "asc" },
            paginationOptions: {
                pageSizeOptions: [10, 20, 50],
                pageSizeInitialValue: 20,
                renderPosition: { bottom: true, top: false },
            },
            searchBoxLabel: i18n.t("Issue Number"),
        };
    }, [filters, analysisId, sectionId, copyContactEmails, exportIssues, showExport]);

    return { tableConfig, refresh };
}

export function useGetRows(
    filters: GetIssuesOptions["filters"],
    reloadKey: number,
    analysisId: Id,
    sectionId: Maybe<Id>,
    refreshIssue: number
) {
    const { compositionRoot } = useAppContext();
    const [loading, setLoading] = React.useState(false);

    const getRows = React.useCallback<GetRows<QualityAnalysisIssue>>(
        (search, pagination, sorting) => {
            return new Promise((resolve, reject) => {
                if (reloadKey < 0 || refreshIssue < 0)
                    return resolve({
                        pager: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
                        objects: [],
                    });

                setLoading(true);
                return compositionRoot.summary.get
                    .execute({
                        pagination: { page: pagination.page, pageSize: pagination.pageSize },
                        sorting: { field: sorting.field, order: sorting.order },
                        filters: {
                            actions: filters.actions,
                            countries: filters.countries,
                            name: search,
                            periods: filters.periods,
                            status: filters.status,
                            analysisIds: [analysisId],
                            sectionId: sectionId,
                            id: undefined,
                            followUp: filters.followUp,
                        },
                    })
                    .run(
                        response => {
                            setLoading(false);
                            resolve({ pager: response.pagination, objects: response.rows });
                        },
                        err => {
                            setLoading(false);
                            reject(new Error(err.message));
                        }
                    );
            });
        },
        [
            compositionRoot.summary.get,
            filters.actions,
            filters.followUp,
            filters.periods,
            filters.status,
            filters.countries,
            sectionId,
            analysisId,
            reloadKey,
            refreshIssue,
        ]
    );

    return { getRows, loading };
}

export const IssueTable: React.FC<IssueTableProps> = React.memo(props => {
    const { analysisId, reload, sectionId, showExport } = props;
    const [filters, setFilters] = React.useState(initialFilters);

    const { tableConfig, refresh } = useTableConfig({
        filters,
        analysisId: analysisId,
        sectionId: sectionId,
        showExport: showExport,
    });
    const { getRows, loading } = useGetRows(filters, reload, analysisId, sectionId, refresh);
    const config = useObjectsTable(tableConfig, getRows);

    const filterComponents = React.useMemo(() => {
        return <IssueFilters initialFilters={filters} onChange={setFilters} />;
    }, [filters]);

    return <ObjectsTable loading={loading} {...config} filterComponents={filterComponents} />;
});

type IssueTableProps = {
    analysisId: Id;
    reload: number;
    sectionId: Maybe<Id>;
    showExport?: boolean;
};

type UseTableConfigProps = {
    analysisId: Id;
    filters: GetIssuesOptions["filters"];
    sectionId: Maybe<Id>;
    showExport?: boolean;
};

type UseCopyContactEmailsProps = { onSuccess?: () => void };
