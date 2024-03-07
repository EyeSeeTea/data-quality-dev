import { ConfigurationStep } from "./steps/ConfigurationStep";
import { DensityStep } from "./steps/DensityStep";
import { DisaggregatesStep } from "./steps/3-disaggregates/DisaggregatesStep";
import { DoctorsStep } from "./steps/DoctorsStep";
import { MidwiferyStep } from "./steps/MidwiferyStep";
import { NursingMidwiferyStep } from "./steps/7-nursingMidwifery/NursingMidwiferyStep";
import { NursingStep } from "./steps/NursingStep";
import { OutliersStep } from "./steps/1-outliers/OutliersStep";
import { ValidationStep } from "./steps/9-validation/ValidationStep";
import { TrendsStep } from "./steps/TrendsStep";
import i18n from "$/utils/i18n";

export const outlierKey =
    "1. Outliers detection analysis based on DHIS2 min-max standard functionality";

export const steps = [
    {
        key: "configuration",
        label: i18n.t("Configuration"),
        component: ConfigurationStep,
    },
    {
        key: outlierKey,
        label: i18n.t("Outliers"),
        component: OutliersStep,
    },
    {
        key: "trends",
        label: i18n.t("Trends"),
        component: TrendsStep,
    },
    {
        key: "disaggregates",
        label: i18n.t("Disaggregates"),
        component: DisaggregatesStep,
    },
    {
        key: "doctors",
        label: i18n.t("Doctors"),
        component: DoctorsStep,
    },
    {
        key: "nursing",
        label: i18n.t("Nursing"),
        component: NursingStep,
    },
    {
        key: "midwifery",
        label: i18n.t("Midwifery"),
        component: MidwiferyStep,
    },
    {
        key: "nursing-midwifery",
        label: i18n.t("Nursing/Midwifery"),
        component: NursingMidwiferyStep,
    },
    {
        key: "density",
        label: i18n.t("Density"),
        component: DensityStep,
    },
    {
        key: "other",
        label: i18n.t("Other"),
        component: ValidationStep,
    },
];
