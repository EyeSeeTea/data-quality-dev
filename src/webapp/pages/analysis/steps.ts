import { GeneralPractitionersStep } from "./steps/4-general-practitioners/GeneralPractitionersStep";
import { DisaggregatesStep } from "./steps/3-disaggregates/DisaggregatesStep";
import { NursingMidwiferyStep } from "./steps/7-nursingMidwifery/NursingMidwiferyStep";
import { OutliersStep } from "./steps/1-outliers/OutliersStep";

export const practitionersKey =
    "4. Medical doctors analysis: General Practicioners missing and double counts";

export const missingNursing = "7. Missing nursing personnel when midwifery personnel is present";

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
];

export function getComponentFromSectionName(name: string) {
    const sectionComponent = sectionsComponents.find(
        component => component.name.toLowerCase() === name.toLowerCase()
    );
    if (!sectionComponent) return undefined;
    return sectionComponent.component;
}
