import React from "react";
import { Wizard } from "@eyeseetea/d2-ui-components";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { outlierKey, steps } from "./steps";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { PageContainer } from "$/webapp/components/page-container/PageContainer";

type PageProps = { name: string };

export const AnalysisPage: React.FC<PageProps> = React.memo(props => {
    const { name } = props;
    const history = useHistory();

    const onBack = () => {
        history.push("/");
    };

    return (
        <PageContainer>
            <PageHeader title={name} onBackClick={onBack} />
            <Stepper steps={steps} />
        </PageContainer>
    );
});

const Stepper = styled(Wizard)`
    .MuiStepper-root {
        overflow-x: scroll;
    }
`;
