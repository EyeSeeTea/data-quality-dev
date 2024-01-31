import React from "react";
import i18n from "../../../../utils/i18n";

interface PageProps {
    name: string;
}

export const OtherStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Custom step with some filtering in order to allow some specific checks" } =
        props;
    return (
        <div>
            <h2>{i18n.t(name)}</h2>
        </div>
    );
});
