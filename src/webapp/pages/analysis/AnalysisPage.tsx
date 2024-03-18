import React from "react";
import { Wizard, WizardStep } from "@eyeseetea/d2-ui-components";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { getComponentFromSectionName } from "./steps";
import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { PageContainer } from "$/webapp/components/page-container/PageContainer";
import { useAnalysisById } from "$/webapp/hooks/useAnalysis";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { ConfigurationStep } from "./steps/ConfigurationStep";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { Maybe } from "$/utils/ts-utils";
import { SummaryStep } from "./steps/10-summary/SummaryStep";

function buildStepsFromSections(
    analysis: QualityAnalysis,
    updateAnalysis: UpdateAnalysisState
): WizardStep[] {
    const sectionSteps = _(analysis.sections)
        .map(section => {
            const StepComponent = getComponentFromSectionName(section.name);
            if (!StepComponent) return undefined;

            return {
                id: section.id,
                key: section.name.toLowerCase(),
                label: section.name,
                component: () => (
                    <StepComponent
                        analysis={analysis}
                        section={section}
                        title={section.description || section.name}
                        updateAnalysis={updateAnalysis}
                        name={section.name}
                    />
                ),
                completed: !QualityAnalysisSection.isPending(section),
            };
        })
        .compact()
        .value();

    return [
        {
            key: "configuration",
            label: i18n.t("Configuration"),
            component: ConfigurationStep,
            completed: true,
        },
        ...sectionSteps,
        { key: "summary", label: i18n.t("Summary"), component: SummaryStep },
    ];
}

export const AnalysisPage: React.FC<PageProps> = React.memo(props => {
    const { name } = props;
    const id = useParams<{ id: string }>();
    const history = useHistory();

    const onBack = () => {
        history.push("/");
    };

    const { analysis, setAnalysis } = useAnalysisById(id);

    const analysisSteps = React.useMemo(() => {
        if (!analysis) return [];
        return buildStepsFromSections(analysis, setAnalysis);
    }, [analysis, setAnalysis]);

    if (!analysis) return null;

    return (
        <PageContainer>
            <PageHeader title={name} onBackClick={onBack} />
            <Stepper initialStepKey="outliers" steps={analysisSteps} />
        </PageContainer>
    );
});

const Stepper = styled(Wizard)`
    .MuiStepper-root {
        overflow-x: scroll;
    }
`;

type PageProps = { name: string };

export type PageStepProps = {
    analysis: QualityAnalysis;
    section: QualityAnalysisSection;
    updateAnalysis: UpdateAnalysisState;
    title: string;
};

export type UpdateAnalysisState = React.Dispatch<React.SetStateAction<Maybe<QualityAnalysis>>>;
