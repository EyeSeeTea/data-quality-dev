import React from "react";
import i18n from "$/utils/i18n";

interface PageProps {
    name: string;
}

export const DensityStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Absolute values and density checks" } = props;
    return (
        <div>
            <h2>{i18n.t(name)}</h2>
        </div>
    );
});
