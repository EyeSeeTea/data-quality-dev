import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import i18n from "../../../utils/i18n";
import { PageHeader } from "../../components/page-header/PageHeader";

export const AnalysisPage: React.FC<PageProps> = React.memo(props => {
    const { name = "Analysis" } = props;
    const title = i18n.t("Hello {{name}}", { name });
    const history = useHistory();

    const goBack = React.useCallback(() => {
        history.goBack();
    }, [history]);

    return (
        <React.Fragment>
            <PageHeader title={i18n.t("Analysis page")} onBackClick={goBack} />
            <Title>{title}</Title>
        </React.Fragment>
    );
});

const Title = styled.h2`
    color: blue;
`;

interface PageProps {
    name: string;
}
