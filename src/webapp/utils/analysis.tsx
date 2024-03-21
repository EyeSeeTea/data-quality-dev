import i18n from "$/utils/i18n";
import { ProgressContainer } from "../pages/dashboard/mock";
import { ProgressStatus } from "../components/progress-status/ProgressStatus";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { TableColumn } from "@eyeseetea/d2-ui-components";

function mapAnalysisStatusToColor(sectionStatus: string) {
    switch (sectionStatus) {
        case "pending":
            return "default";
        case "success_with_issues":
            return "danger";
        case "success":
            return "success";
        default:
            return "default";
    }
}

export const analysisColumns: TableColumn<QualityAnalysis>[] = [
    { name: "name", text: i18n.t("Name"), sortable: true },
    { name: "module", text: i18n.t("Dataset"), sortable: true },
    { name: "startDate", text: i18n.t("Start Date"), sortable: true },
    { name: "endDate", text: i18n.t("End Date"), sortable: true },
    { name: "status", text: i18n.t("Status"), sortable: true },
    {
        name: "sections",
        text: i18n.t("Progress"),
        sortable: false,
        getValue: row => {
            return (
                <ProgressContainer>
                    {row.sections.map((value, index) => (
                        <ProgressStatus
                            key={index}
                            position={index + 1}
                            status={mapAnalysisStatusToColor(value.status)}
                            name={value.name}
                        />
                    ))}
                </ProgressContainer>
            );
        },
    },
    { name: "lastModification", text: i18n.t("Last Modification"), sortable: true },
];
