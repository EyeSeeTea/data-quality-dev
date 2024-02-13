import React from "react";
import { Wizard } from "@eyeseetea/d2-ui-components";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import i18n from "$/utils/i18n";
import { steps } from "./steps";

type PageProps = {
    name: string;
};

export const AnalysisPage: React.FC<PageProps> = React.memo(props => {
    const { name } = props;
    return (
        <React.Fragment>
            <PageHeader title={i18n.t(name)} />
            <Wizard steps={steps} />
        </React.Fragment>
    );
});
