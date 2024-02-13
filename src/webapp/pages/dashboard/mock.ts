import i18n from "$/utils/i18n";
import { TableColumn } from "@eyeseetea/d2-ui-components";

type ReferenceObject<T> = {
    id: string;
    selectable?: boolean | undefined;
} & T;

export interface TableModel {
    id: string;
    name: string;
    dataset: string;
    startDate: number;
    endDate: number;
    status: "In Progress" | "Completed";
    progress: string[];
    lastModification: string;
}

export const columns: TableColumn<TableModel>[] = [
    { name: "name", text: i18n.t("Name"), sortable: true },
    { name: "dataset", text: i18n.t("Dataset"), sortable: true },
    { name: "startDate", text: i18n.t("Start Date"), sortable: true },
    { name: "endDate", text: i18n.t("End Date"), sortable: true },
    { name: "status", text: i18n.t("Status"), sortable: true },
    { name: "progress", text: i18n.t("Progress"), sortable: false },
    { name: "lastModification", text: i18n.t("Last Modification"), sortable: true },
];

export const mockRows: ReferenceObject<TableModel>[] = [
    {
        id: "1",
        selectable: true,
        name: "Prabodhan Fitzgerald analysis",
        dataset: "Module 1",
        startDate: 2023,
        endDate: 2024,
        status: "In Progress",
        progress: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        lastModification: "2023-07-21 11:50:52",
    },
    {
        id: "2",
        selectable: true,
        name: "Analysis 2 Hiro Joyce",
        dataset: "Module 2",
        startDate: 2021,
        endDate: 2023,
        status: "Completed",
        progress: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        lastModification: "2022-07-21 11:50:52",
    },
    {
        id: "3",
        selectable: true,
        name: "Ceiran Mayo final final",
        dataset: "Module 1",
        startDate: 2020,
        endDate: 2024,
        status: "In Progress",
        progress: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        lastModification: "2021-07-21 11:50:52",
    },
];
