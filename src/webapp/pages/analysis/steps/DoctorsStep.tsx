import React from "react";
import i18n from "$/utils/i18n";

interface PageProps {
    name: string;
}

export const DoctorsStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Medical doctors analysis: General Practicioners missing and double counts" } =
        props;
    return (
        <div>
            <h2>{i18n.t(name)}</h2>
        </div>
    );
});
