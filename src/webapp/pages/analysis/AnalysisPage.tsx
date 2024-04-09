import React from "react";
import { makeStyles } from "@material-ui/core";
import { Wizard, WizardStep } from "@eyeseetea/d2-ui-components";
import SettingsIcon from "@material-ui/icons/Settings";
import ListAltIcon from "@material-ui/icons/ListAlt";
import CheckIcon from "@material-ui/icons/Check";
import customTheme from "$/webapp/pages/app/themes/customTheme";
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
import { SummaryStep } from "./SummaryStep";
import { ClassNameMap } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
    circle: {
        alignItems: "center",
        borderRadius: "50%",
        color: "#fff",
        display: "flex",
        height: "24px",
        justifyContent: "center",
        width: "24px",
    },
    active: {
        backgroundColor: "#1976d2",
    },
    inactive: {
        backgroundColor: "#8E8E8E",
    },
    completed: {
        backgroundColor: customTheme.color.intenseGreen,
    },
    withIssues: {
        backgroundColor: customTheme.color.error,
    },
    largeIcon: {
        fontSize: "20px",
        color: "#fff",
        backgroundColor: "#1976d2",
        borderRadius: 50,
        padding: "0.125rem",
    },
}));

function StepIcon(props: {
    completed: boolean;
    active: boolean;
    text: string;
    hasIssues: boolean;
}) {
    const { active, text, hasIssues } = props;
    const classes = useStyles();
    if (!hasIssues)
        return (
            <CheckIcon
                className={classes.largeIcon}
                htmlColor={`${customTheme.color.intenseGreen}`}
            />
        );

    const issueClasses = _([classes.circle, classes.withIssues]).compact().join(" ");

    if (hasIssues) return <div className={issueClasses}>{text}</div>;

    const mergeClasses = _([classes.circle, active ? classes.active : classes.inactive])
        .compact()
        .join(" ");

    return <div className={mergeClasses}>{text}</div>;
}

function buildStepsFromSections(
    analysis: QualityAnalysis,
    updateAnalysis: UpdateAnalysisState,
    currentSection: Maybe<string>,
    classes: ClassNameMap<"circle" | "active" | "inactive" | "largeIcon">
): WizardStep[] {
    const sectionSteps = _(analysis.sections)
        .map((section): Maybe<WizardStep & { id: string }> => {
            const StepComponent = getComponentFromSectionName(section.name);
            if (!StepComponent) return undefined;

            const index = analysis.sections.findIndex(s => s.id === section.id) + 1;
            const isActive = currentSection === section.name;
            const isCompleted = !QualityAnalysisSection.isPending(section);
            const hasIssues = section.issues.length > 0;

            return {
                id: section.id,
                icon: (
                    <StepIcon
                        active={isActive}
                        completed={isCompleted}
                        text={String(index)}
                        hasIssues={hasIssues}
                    />
                ),
                key: section.name.toLowerCase(),
                label: section.name,
                component: () => (
                    <StepComponent
                        analysis={analysis}
                        section={section}
                        title={section.description || section.name}
                        updateAnalysis={updateAnalysis}
                    />
                ),
                completed: isCompleted,
            };
        })
        .compact()
        .value();

    return [
        {
            key: "Configuration",
            label: i18n.t("Configuration"),
            component: ConfigurationStep,
            completed: false,
            icon: <SettingsIcon className={classes.largeIcon} color="primary" />,
        },
        ...sectionSteps,
        {
            icon: <ListAltIcon className={classes.largeIcon} color="primary" />,
            key: "Summary",
            label: i18n.t("Summary"),
            component: () => <SummaryStep analysis={analysis} name={i18n.t("Summary")} />,
            completed: false,
        },
    ];
}

export const AnalysisPage: React.FC<PageProps> = React.memo(() => {
    const id = useParams<{ id: string }>();
    const [currentSection, setSection] = React.useState<string>("outliers");
    const history = useHistory();
    const classes = useStyles();

    const onBack = () => {
        history.push("/");
    };

    const { analysis, setAnalysis } = useAnalysisById(id);

    const analysisSteps = React.useMemo(() => {
        if (!analysis) return [];
        return buildStepsFromSections(analysis, setAnalysis, currentSection, classes);
    }, [analysis, setAnalysis, currentSection, classes]);

    if (!analysis) return null;

    const firstSectionName = _(analysis.sections).first()?.name.toLowerCase();
    if (!firstSectionName) {
        console.warn(`Cannot found sections in analysis: ${analysis.name}`);
        return null;
    }

    return (
        <PageContainer>
            <PageHeader title={`${analysis.name} - ${currentSection}`} onBackClick={onBack} />
            <Stepper
                lastClickableStepIndex={analysisSteps.length}
                initialStepKey={firstSectionName}
                steps={analysisSteps}
                onStepChange={value => {
                    const section = analysis.sections.find(s => s.name.toLowerCase() === value);
                    setSection(section?.name || value);
                }}
            />
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
