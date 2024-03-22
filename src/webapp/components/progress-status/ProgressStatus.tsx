import Typography from "@material-ui/core/Typography";
import styled, { css } from "styled-components";
import React from "react";
import customTheme from "$/webapp/pages/app/themes/customTheme";
import Tooltip from "@material-ui/core/Tooltip";

type Props = {
    status: string;
    name: string;
    position: number;
};

export type ContainerProps = {
    $status: Props["status"];
};

export const ProgressStatus: React.FC<Props> = React.memo(({ status, name, position }) => {
    return (
        <Container $status={status}>
            <Tooltip title={name}>
                <StyledTypography>{position}</StyledTypography>
            </Tooltip>
        </Container>
    );
});

const Container = styled.li<ContainerProps>`
    border-radius: 50%;
    border: 1px solid ${customTheme.color.lightGrey};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.75rem;
    width: 1.75rem;
    background-color: ${customTheme.color.lightGrey};
    cursor: default;

    ${({ $status }) =>
        $status === "success" &&
        css`
            background-color: ${customTheme.color.lightGreen};
            border-color: ${customTheme.color.lightGreen};
        `};

    ${({ $status }) =>
        $status === "danger" &&
        css`
            background-color: ${customTheme.color.lightRed};
            border-color: ${customTheme.color.lightRed};
        `};
`;

const StyledTypography = styled(Typography)`
    font-size: 0.75rem;
    color: ${customTheme.color.dark};
`;
