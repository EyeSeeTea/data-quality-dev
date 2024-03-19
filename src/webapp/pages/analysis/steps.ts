import { GeneralPractitionersStep } from "./steps/4-general-practitioners/GeneralPractitionersStep";
import { DisaggregatesStep } from "./steps/3-disaggregates/DisaggregatesStep";
import { NursingMidwiferyStep } from "./steps/7-nursingMidwifery/NursingMidwiferyStep";
import { OutliersStep } from "./steps/1-outliers/OutliersStep";
import { ValidationStep } from "./steps/9-validation/ValidationStep";

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
        name: "General Practitioners",
        component: GeneralPractitionersStep,
    },
    {
        name: "Nursing/Midwifery",
        component: NursingMidwiferyStep,
    },
    {
        name: "Validation",
        component: ValidationStep,
    },
];

export function getComponentFromSectionName(name: string) {
    const sectionComponent = sectionsComponents.find(
        component => component.name.toLowerCase() === name.toLowerCase()
    );
    if (!sectionComponent) return undefined;
    return sectionComponent.component;
}
