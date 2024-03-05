import { ConfigurationStep } from "./steps/ConfigurationStep";
import { DensityStep } from "./steps/DensityStep";
import { DisaggregatesStep } from "./steps/DisaggregatesStep";
import { GeneralPractitionersStep } from "./steps/4-general-practitioners/GeneralPractitionersStep";
import { MidwiferyStep } from "./steps/MidwiferyStep";
import { NursingMidwiferyStep } from "./steps/NursingMidwiferyStep";
import { NursingStep } from "./steps/NursingStep";
import { OtherStep } from "./steps/OtherStep";
import { OutliersStep } from "./steps/step1-outliers/OutliersStep";
import { TrendsStep } from "./steps/TrendsStep";
import i18n from "$/utils/i18n";

export const outlierKey =
    "1. Outliers detection analysis based on DHIS2 min-max standard functionality";

export const steps = [
    {
        key: "configuration",
        label: i18n.t("Configuration"),
        component: ConfigurationStep,
        completed: false,
    },
    {
        key: outlierKey,
        label: i18n.t("Outliers"),
        component: OutliersStep,
        completed: true,
    },
    {
        key: "trends",
        label: i18n.t("Trends"),
        component: TrendsStep,
        completed: false,
    },
    {
        key: "disaggregates",
        label: i18n.t("Disaggregates"),
        component: DisaggregatesStep,
        completed: false,
    },
    {
        key: "general-practitioners",
        label: i18n.t("General Practitioners"),
        component: GeneralPractitionersStep,
        completed: false,
    },
    {
        key: "nursing",
        label: i18n.t("Nursing"),
        component: NursingStep,
        completed: false,
    },
    {
        key: "midwifery",
        label: i18n.t("Midwifery"),
        component: MidwiferyStep,
        completed: false,
    },
    {
        key: "nursing-midwifery",
        label: i18n.t("Nursing/Midwifery"),
        component: NursingMidwiferyStep,
        completed: false,
    },
    {
        key: "density",
        label: i18n.t("Density"),
        component: DensityStep,
        completed: false,
    },
    {
        key: "other",
        label: i18n.t("Other"),
        component: OtherStep,
        completed: false,
    },
];
