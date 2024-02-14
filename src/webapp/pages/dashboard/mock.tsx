import i18n from "$/utils/i18n";
import styled from "styled-components";
import { TableColumn } from "@eyeseetea/d2-ui-components";
import { ProgressStatus } from "$/webapp/components/progress-status/ProgressStatus";

type ReferenceObject<T> = {
    id: string;
    selectable?: boolean | undefined;
} & T;

export type Step = {
    position: number;
    status: "default" | "complete";
};

export interface TableModel {
    id: string;
    name: string;
    dataset: string;
    startDate: number;
    endDate: number;
    status: "In Progress" | "Completed";
    progress: Step[];
    lastModification: string;
}

export const columns: TableColumn<TableModel>[] = [
    { name: "name", text: i18n.t("Name"), sortable: true },
    { name: "dataset", text: i18n.t("Dataset"), sortable: true },
    { name: "startDate", text: i18n.t("Start Date"), sortable: true },
    { name: "endDate", text: i18n.t("End Date"), sortable: true },
    { name: "status", text: i18n.t("Status"), sortable: true },
    {
        name: "progress",
        text: i18n.t("Progress"),
        sortable: false,
        getValue: row => {
            return (
                <ProgressContainer>
                    {row.progress.map(value => (
                        <ProgressStatus
                            status={value.status}
                            position={value.position}
                            key={value.position}
                        />
                    ))}
                </ProgressContainer>
            );
        },
    },
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
        progress: [
            { position: 1, status: "default" },
            { position: 2, status: "complete" },
            { position: 3, status: "default" },
            { position: 4, status: "complete" },
            { position: 5, status: "default" },
            { position: 6, status: "default" },
            { position: 7, status: "default" },
            { position: 8, status: "default" },
            { position: 9, status: "complete" },
        ],
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
        progress: [
            { position: 1, status: "default" },
            { position: 2, status: "complete" },
            { position: 3, status: "default" },
            { position: 4, status: "complete" },
            { position: 5, status: "default" },
            { position: 6, status: "default" },
            { position: 7, status: "default" },
            { position: 8, status: "default" },
            { position: 9, status: "complete" },
        ],
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
        progress: [
            { position: 1, status: "default" },
            { position: 2, status: "complete" },
            { position: 3, status: "default" },
            { position: 4, status: "complete" },
            { position: 5, status: "default" },
            { position: 6, status: "default" },
            { position: 7, status: "default" },
            { position: 8, status: "default" },
            { position: 9, status: "complete" },
        ],
        lastModification: "2021-07-21 11:50:52",
    },
];

const ProgressContainer = styled.ul`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-inline-start: unset;
`;
