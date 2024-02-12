import Typography from "@material-ui/core/Typography";
import styled, { css } from "styled-components";
import React from "react";
import customTheme from "$/webapp/pages/app/themes/customTheme";
import { Step } from "$/webapp/pages/dashboard/mock";

type Props = {
    value: Step[];
};

export type ListElementProps = {
    $variant: Step["status"];
};

export const Progress: React.FC<Props> = React.memo(({ value }) => {
    return (
        <Container>
            {value.map(step => (
                <ListElement $variant={step.status} key={step.position}>
                    <StyledTypography>{step.position}</StyledTypography>
                </ListElement>
            ))}
        </Container>
    );
});

const Container = styled.ul`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-inline-start: unset;
`;

const ListElement = styled.li<ListElementProps>`
    border-radius: 50%;
    border: 1px solid ${customTheme.color.lightGrey};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.75rem;
    width: 1.75rem;
    background-color: ${customTheme.color.lightGrey};

    ${({ $variant }) =>
        $variant === "complete" &&
        css`
            background-color: ${customTheme.color.lightGreen};
            border-color: ${customTheme.color.lightGreen};
        `};
`;

const StyledTypography = styled(Typography)`
    font-size: 0.75rem;
    color: ${customTheme.color.white};
`;
