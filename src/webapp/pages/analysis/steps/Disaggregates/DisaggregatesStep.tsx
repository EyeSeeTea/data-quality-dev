import React from "react";
import i18n from "$/utils/i18n";
import { MultipleDropdown } from "@eyeseetea/d2-ui-components";
import { useDisaggregatesStep } from "./hooks/useDisaggregatesStep";

interface PageProps {
    name: string;
}

export const DisaggregatesStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Missing disaggregates in selected catcombos" } = props;
    const { dropdownItems, values, handleChange } = useDisaggregatesStep();

    return (
        <div>
            <h2>{i18n.t(name)}</h2>
            <MultipleDropdown
                items={dropdownItems}
                label={i18n.t("CatCombos")}
                values={values}
                onChange={handleChange}
            />
        </div>
    );
});
