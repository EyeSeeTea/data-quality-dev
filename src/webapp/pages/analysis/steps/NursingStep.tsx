import React from "react";
import styled from "styled-components";
import i18n from "../../../../utils/i18n";

export const NursingStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Nursing personnel analysis" } = props;
    return (
        <Container>
            <Title>{i18n.t(name)}</Title>
        </Container>
    );
});

const Container = styled.section`
    height: 39.125rem;
`;

const Title = styled.h2`
    color: blue;
`;

interface PageProps {
    name: string;
}
