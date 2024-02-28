import i18n from "$/utils/i18n";
import { useState } from "react";

export function useGeneralPractitionersStep() {
    const [values, setValues] = useState<string[]>([]);

    const handleChange = (values: string[]) => {
        setValues(values);
    };

    const catCombosItems = [
        {
            value: "ACTIVITY",
            text: i18n.t("Activity Level"),
        },
        {
            value: "SEX",
            text: i18n.t("Sex"),
        },
        {
            value: "AGE",
            text: i18n.t("Age group"),
        },
        {
            value: "BIRTH",
            text: i18n.t("Place of Birth"),
        },
        {
            value: "OWNERSHIP",
            text: i18n.t("Ownership"),
        },
        {
            value: "VACANCY",
            text: i18n.t("Vacancy rate"),
        },
        {
            value: "APPLICATIONS",
            text: i18n.t("Applications"),
        },
        {
            value: "ENROLLED",
            text: i18n.t("Enrolled"),
        },
    ];

    const runAnalysis = (e: any) => {
        alert(`run analysis`);
    };

    const doubleCountsItems = [
        {
            value: "1",
            text: "+/- 1%",
        },
        {
            value: "2",
            text: "+/- 2%",
        },
        {
            value: "3",
            text: "+/- 3%",
        },
        {
            value: "4",
            text: "+/- 4%",
        },
        {
            value: "5",
            text: "+/- 5%",
        },
    ];

    const valueChange = (e: any) => {
        alert(`Valor cambiado: ${e.target.value}`);
    };

    return {
        doubleCountsItems,
        values,
        handleChange,
        runAnalysis,
        valueChange,
        catCombosItems,
    };
}
