import React from "react";
import i18n from "../../../../utils/i18n";

export const NursingMidwiferyStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Missing nursing personnel when midwifery personnel is present" } = props;
    return (
        <div>
            <h2>{i18n.t(name)}</h2>
        </div>
    );
});

interface PageProps {
    name: string;
}
