import React from "react";
import i18n from "../../../../utils/i18n";

interface PageProps {
    name: string;
}

export const OutliersStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Outliers detection analysis based on DHIS2 min-max standard functionality" } =
        props;
    return (
        <div>
            <h2>{i18n.t(name)}</h2>
        </div>
    );
});
