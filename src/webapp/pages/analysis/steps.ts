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

export const steps = [
    {
        key: "configuration",
        label: i18n.t("Configuration"),
        component: ConfigurationStep,
    },
    {
        key: "outliers",
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
        key: "general-practitioners",
        label: i18n.t("General Practitioners"),
        component: GeneralPractitionersStep,
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
        component: OtherStep,
    },
];
