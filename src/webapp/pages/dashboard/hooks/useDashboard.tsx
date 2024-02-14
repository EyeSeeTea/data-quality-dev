import { Dropdown } from "@eyeseetea/d2-ui-components";
import { useCallback } from "react";
import i18n from "$/utils/i18n";

export function useDashboard() {
    const dropdownItems = [
        {
            value: "READY",
            text: i18n.t("Ready"),
        },
        {
            value: "RUNNING",
            text: i18n.t("Running"),
        },
        {
            value: "FAILURE",
            text: i18n.t("Failure"),
        },
        {
            value: "DONE",
            text: i18n.t("Done"),
        },
    ];

    const valueChange = (e: any) => {
        alert(`Valor cambiado: ${e.target.value}`);
    };

    const handleSearchChange = useCallback((newSearch: string) => {
        alert(newSearch);
    }, []);

    const customFilters = (
        <>
            <Dropdown
                key={"level-filter"}
                items={dropdownItems}
                onChange={valueChange}
                value={"somevalue"}
                label={i18n.t("Dataset")}
            />
            <Dropdown
                key={"level-filter1"}
                items={dropdownItems}
                onChange={valueChange}
                value={"somevalue"}
                label={i18n.t("Start Date")}
            />
            <Dropdown
                key={"level-filter2"}
                items={dropdownItems}
                onChange={valueChange}
                value={"somevalue"}
                label={i18n.t("End Date")}
            />
            <Dropdown
                key={"level-filter3"}
                items={dropdownItems}
                onChange={valueChange}
                value={"somevalue"}
                label={i18n.t("Status")}
            />
        </>
    );

    return {
        customFilters,
        handleSearchChange,
    };
}
