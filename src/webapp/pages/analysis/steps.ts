import { ConfigurationStep } from "./steps/ConfigurationStep";
import { DensityStep } from "./steps/DensityStep";
import { DisaggregatesStep } from "./steps/DisaggregatesStep";
import { DoctorsStep } from "./steps/DoctorsStep";
import { MidwiferyStep } from "./steps/MidwiferyStep";
import { NursingMidwiferyStep } from "./steps/NursingMidwiferyStep";
import { NursingStep } from "./steps/NursingStep";
import { OtherStep } from "./steps/OtherStep";
import { OutliersStep } from "./steps/OutliersStep";
import { TrendsStep } from "./steps/TrendsStep";

export const steps = [
    {
        key: "configuration",
        label: "Configuration",
        component: ConfigurationStep,
    },
    {
        key: "outliers",
        label: "Outliers",
        component: OutliersStep,
    },
    {
        key: "trends",
        label: "Trends",
        component: TrendsStep,
    },
    {
        key: "disaggregates",
        label: "Disaggregates",
        component: DisaggregatesStep,
    },
    {
        key: "doctors",
        label: "Doctors",
        component: DoctorsStep,
    },
    {
        key: "nursing",
        label: "Nursing",
        component: NursingStep,
    },
    {
        key: "midwifery",
        label: "Midwifery",
        component: MidwiferyStep,
    },
    {
        key: "nursing-midwifery",
        label: "Nursing/Midwifery",
        component: NursingMidwiferyStep,
    },
    {
        key: "density",
        label: "Density",
        component: DensityStep,
    },
    {
        key: "other",
        label: "Other",
        component: OtherStep,
    },
];
