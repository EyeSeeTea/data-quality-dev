import { ConfigurationStep } from "./steps/ConfigurationStep";
import { DensityStep } from "./steps/DensityStep";
import { GeneralPractitionersStep } from "./steps/4-general-practitioners/GeneralPractitionersStep";
import { DisaggregatesStep } from "./steps/3-disaggregates/DisaggregatesStep";
import { MidwiferyStep } from "./steps/MidwiferyStep";
import { NursingMidwiferyStep } from "./steps/7-nursingMidwifery/NursingMidwiferyStep";
import { NursingStep } from "./steps/NursingStep";
import { OutliersStep } from "./steps/1-outliers/OutliersStep";
import { ValidationStep } from "./steps/9-validation/ValidationStep";
import { TrendsStep } from "./steps/TrendsStep";
import i18n from "$/utils/i18n";

export const outlierKey =
    "1. Outliers detection analysis based on DHIS2 min-max standard functionality";

export const disaggregateKey = "3. Missing disaggregates in selected catcombos ";

export const practitionersKey =
    "4. Medical doctors analysis: General Practicioners missing and double counts";

export const missingNursing = "7. Missing nursing personnel when midwifery personnel is present";

export const steps = [
    {
        key: "configuration",
        label: i18n.t("Configuration"),
        component: ConfigurationStep,
        completed: true,
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
        key: practitionersKey,
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
        key: missingNursing,
        label: i18n.t("Nursing/Midwifery"),
        component: NursingMidwiferyStep,
        completed: false,
    },
    {
        key: "midwifery",
        label: i18n.t("Midwifery"),
        component: MidwiferyStep,
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
        component: ValidationStep,
    },
];
