import { useState } from "react";
import i18n from "$/utils/i18n";

export function useNursingMidwiferyStep() {
    const dropdownItems = [
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

    const [values, setValues] = useState<string[]>(dropdownItems.map(item => item.value));

    const handleChange = (values: string[]) => {
        setValues(values);
    };

    const runAnalysis = (e: any) => {
        alert(`run analysis`);
    };

    return {
        dropdownItems,
        values,
        handleChange,
        runAnalysis,
    };
}