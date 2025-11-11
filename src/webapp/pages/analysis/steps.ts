import { GeneralPractitionersStep } from "./steps/3-general-practitioners/GeneralPractitionersStep";
import { DisaggregatesStep } from "./steps/2-disaggregates/DisaggregatesStep";
import { NursingMidwiferyStep } from "./steps/4-nursingMidwifery/NursingMidwiferyStep";
import { OutliersStep } from "./steps/1-outliers/OutliersStep";
import { ValidationStep } from "./steps/5-validation/ValidationStep";
import { ManualIssuesStep } from "$/webapp/pages/analysis/steps/6-manual-issues/ManualIssuesStep";

const sectionsComponents = [
    {
        name: "Outliers",
        component: OutliersStep,
    },
    {
        name: "Disaggregates",
        component: DisaggregatesStep,
    },
    {
        name: "Double counts and missing GP",
        component: GeneralPractitionersStep,
    },
    {
        name: "Missing Nurses",
        component: NursingMidwiferyStep,
    },
    {
        name: "Validation",
        component: ValidationStep,
    },
    {
        name: "Manual Issues",
        component: ManualIssuesStep,
    },
];

export function getComponentFromSectionName(code: string) {
    const sectionComponent = sectionsComponents.find(
        component => component.name.toLowerCase() === code.toLowerCase()
    );
    if (!sectionComponent) return undefined;
    return sectionComponent.component;
}
