import React from "react";
import i18n from "$/utils/i18n";

interface PageProps {
    name: string;
}

export const TrendsStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Temporal trend to detect drastic trends modification" } = props;
    return (
        <div>
            <h2>{i18n.t(name)}</h2>
        </div>
    );
});
