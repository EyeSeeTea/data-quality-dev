import React from "react";
import { Button, Typography } from "@material-ui/core";
import styled from "styled-components";

import i18n from "$/utils/i18n";
import { Id } from "$/domain/entities/Ref";
import { EmptyState } from "$/webapp/components/empty-state/EmptyState";
import { IssueTable } from "$/webapp/components/issues/IssueTable";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";

export const StepAnalysis: React.FC<StepContainerProps> = React.memo(props => {
    const { children, id, onRun, reload, section, title, allowRerun } = props;

    const runButtonText = props.runButtonText || i18n.t("Run");
    const emptyMessage = props.emptyMessage || i18n.t("Run to get results");
    const isPending = QualityAnalysisSection.isPending(section);
    const showRunButton = isPending || allowRerun;

    return (
        <Container>
            <>
                <AnalysisHeader>
                    <StyledTypography variant="h2">{title}</StyledTypography>
                    {showRunButton && (
                        <FiltersContainer>
                            {children}
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => onRun()}
                            >
                                {runButtonText}
                            </Button>
                        </FiltersContainer>
                    )}
                </AnalysisHeader>
                {isPending && <EmptyState message={emptyMessage} variant="neutral" />}
                {section.status === "success" && (
                    <EmptyState message={i18n.t("No Issues found")} variant="success" />
                )}
            </>
            {section.status === "success_with_issues" && (
                <IssueTable analysisId={id} reload={reload} sectionId={section.id} />
            )}
        </Container>
    );
});

const Container = styled.section``;

const AnalysisHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 5rem;
    gap: 8rem;
    margin-block-end: 1.75rem;
`;

const StyledTypography = styled(Typography)`
    font-size: 1.2rem;
    font-weight: 500;
`;

const FiltersContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

type StepContainerProps = {
    id: Id;
    children?: React.ReactNode;
    reload: number;
    section: QualityAnalysisSection;
    title: string;
    onRun: () => void;
    allowRerun?: boolean;
    emptyMessage?: string;
    runButtonText?: string;
};
