import React from "react";
import styled from "styled-components";
import i18n from "../../../../utils/i18n";

export const DoctorsStep: React.FC<PageProps> = React.memo(props => {
    const { name = "Medical doctors analysis: General Practicioners missing and double counts" } =
        props;
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
