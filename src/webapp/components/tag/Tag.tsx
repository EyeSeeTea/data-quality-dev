import styled, { css } from "styled-components";
import customTheme from "$/webapp/pages/app/themes/customTheme";
import { memo } from "react";

type Props = {
    status: string;
};

export type ContainerProps = {
    $status: Props["status"];
};

export const Tag: React.FC<Props> = memo(({ status }) => {
    return <Container $status={status}>{status}</Container>;
});

export const Container = styled.span<ContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: 7px;
    padding-inline: 4px;
    border-radius: 19px;
    min-height: 24px;
    font-size: 0.8125rem;
    width: 100%;
    white-space: nowrap;
    text-transform: capitalize;

    ${({ $status }) => {
        switch ($status) {
            case "In Progress":
                return css`
                    color: ${customTheme.color.dark};
                    background-color: ${customTheme.color.lighterGrey};
                `;
            case "Completed":
                return css`
                    color: ${customTheme.color.light};
                    background-color: ${customTheme.color.green};
                `;
        }
    }}
`;
