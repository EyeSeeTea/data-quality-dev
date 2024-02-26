import styled from "styled-components";

export type Step = {
    position: number;
    status: "default" | "complete" | string;
};

export const ProgressContainer = styled.ul`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-inline-start: unset;
`;
