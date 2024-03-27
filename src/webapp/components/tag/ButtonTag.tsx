import styled, { css } from "styled-components";
import customTheme from "$/webapp/pages/app/themes/customTheme";
import { memo } from "react";

type Props = {
    text: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export type ButtonProps = {
    $text: Props["text"];
};

export const ButtonTag: React.FC<Props> = memo(({ text, onClick }) => {
    return text ? (
        <Button $text={text} onClick={onClick} aria-controls="simple-menu" aria-haspopup="true">
            {text}
        </Button>
    ) : (
        <Button $text={text} onClick={onClick} aria-controls="simple-menu" aria-haspopup="true">
            {(text = "No Action")}
        </Button>
    );
});

export const Button = styled.button<ButtonProps>`
    all: unset;
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

    ${({ $text: $status }) => {
        switch ($status) {
            case "Not treated":
                return css`
                    color: ${customTheme.color.dark};
                    background-color: ${customTheme.color.lighterGrey};
                `;
            case "Dismissed":
                return css`
                    color: ${customTheme.color.light};
                    background-color: ${customTheme.color.grey};
                `;
            case "Resolved":
                return css`
                    color: ${customTheme.color.light};
                    background-color: ${customTheme.color.intenseGreen};
                `;
            case "Waiting for focal point":
                return css`
                    color: ${customTheme.color.lightWarning};
                    background-color: ${customTheme.color.warning};
                `;
            case "In treatment":
                return css`
                    color: ${customTheme.color.green};
                    background-color: ${customTheme.color.lighterGreen};
                `;
            default:
                return css`
                    color: ${customTheme.color.dark};
                    background-color: ${customTheme.color.lighterGrey};
                `;
        }
    }}
`;
