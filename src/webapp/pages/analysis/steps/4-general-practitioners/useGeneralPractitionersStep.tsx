import i18n from "$/utils/i18n";
import { useState } from "react";

export function useGeneralPractitionersStep() {
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
            text: i18n.t("Age Group"),
        },
        {
            value: "AGESEX",
            text: i18n.t("Age Group + Sex"),
        },
        {
            value: "BIRTHPLACE",
            text: i18n.t("Place of Birth"),
        },
        {
            value: "TRAININGPLACE",
            text: i18n.t("Place of Training"),
        },
        {
            value: "FOREIGNTRAINED",
            text: i18n.t("Foreign Trained"),
        },
        {
            value: "OWNERSHIP",
            text: i18n.t("Ownership"),
        },
        {
            value: "WORKINGFACILITYTYPE",
            text: i18n.t("Working Facility Type"),
        },
        {
            value: "NADOMESTICTHWF",
            text: i18n.t("Newly Active domestic trained HWF"),
        },
        {
            value: "NAFOREIGNTE",
            text: i18n.t("Newly Active foreign trained employed"),
        },
        {
            value: "VOLUNTARY",
            text: i18n.t("Voluntary Exits"),
        },
        {
            value: "INVOLUNTARY",
            text: i18n.t("Involuntary exits"),
        },
        {
            value: "VACANCY",
            text: i18n.t("Vacancy rate"),
        },
        {
            value: "CONTRACT",
            text: i18n.t("Contract Type"),
        },
        {
            value: "APPLICATIONS",
            text: i18n.t("Applications"),
        },
        {
            value: "ENROLLED",
            text: i18n.t("Enrolled"),
        },
        {
            value: "GRADUATESGENDER",
            text: i18n.t("Graduates by Gender"),
        },
        {
            value: "GRADUATESINSTITUTION",
            text: i18n.t("Graduates by institution ownership"),
        },
        {
            value: "TOTAL",
            text: i18n.t("Total"),
        },
        {
            value: "TOTALNEWLYACTIVE",
            text: i18n.t("Total Newly Active Health Workers"),
        },
        {
            value: "TOTALEXITS",
            text: i18n.t("Total Number of exits"),
        },
    ];

    const [values, setValues] = useState<string[]>(catCombosList.map(item => item.value));

    const handleChange = (values: string[]) => {
        setValues(values);
    };

    const runAnalysis = (e: any) => {
        alert(`run analysis`);
    };

    const doubleCountsList = [
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
        doubleCountsList,
        values,
        handleChange,
        runAnalysis,
        valueChange,
        catCombosList,
    };
}
