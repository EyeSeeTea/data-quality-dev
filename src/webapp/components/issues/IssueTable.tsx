import React from "react";
import { GetRows, TableConfig } from "@eyeseetea/d2-ui-components";

import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { GetIssuesOptions } from "$/domain/repositories/IssueRepository";
import i18n from "$/utils/i18n";
import { Id } from "$/domain/entities/Ref";
import { EditIssueValue } from "./EditIssueValue";

export function useTableConfig() {
    const [refresh, setRefresh] = React.useState(0);
    const tableConfig = React.useMemo<TableConfig<QualityAnalysisIssue>>(() => {
        return {
            actions: [],
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
                        return <EditIssueValue key={value.id} field="azureUrl" issue={value} />;
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
            initialSorting: { field: "number", order: "desc" },
            paginationOptions: { pageSizeOptions: [10, 20, 50], pageSizeInitialValue: 20 },
            searchBoxLabel: i18n.t("Issue Number"),
        };
    }, []);

    return { tableConfig, refresh };
}

export function useGetRows(
    filters: GetIssuesOptions["filters"],
    reloadKey: number,
    analysisId: Id,
    sectionId: Id,
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
                return compositionRoot.outlier.get
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
            compositionRoot.outlier.get,
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
