import { ChangeEvent, useState } from "react";
import i18n from "$/utils/i18n";

export function useDisaggregatesStep() {
    const catCombosList = [
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

    const defaultValues = catCombosList.map(option => option.text);

    const [value, setValue] = useState<string[]>(defaultValues);

    const handleChange = (event: ChangeEvent<any>) => {
        const selectedValues = event.target.value as string[];
        setValue(selectedValues);
    };

    const runAnalysis = (e: any) => {
        alert(`run analysis`);
    };

    return {
        catCombosList,
        value,
        handleChange,
        runAnalysis,
    };
}
