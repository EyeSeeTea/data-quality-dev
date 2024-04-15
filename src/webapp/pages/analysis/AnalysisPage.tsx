import React, { useEffect } from "react";
import { Wizard, WizardStep, useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import { ClassNameMap } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import ListAltIcon from "@material-ui/icons/ListAlt";
import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";

import customTheme from "$/webapp/pages/app/themes/customTheme";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { getComponentFromSectionName } from "./steps";
import { PageContainer } from "$/webapp/components/page-container/PageContainer";
import { useAnalysisById } from "$/webapp/hooks/useAnalysis";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { ConfigurationStep } from "./steps/ConfigurationStep";
import i18n from "$/utils/i18n";
import _ from "$/domain/entities/generic/Collection";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { Maybe } from "$/utils/ts-utils";
import { SummaryStep } from "./SummaryStep";

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
    pending: {
        backgroundColor: "#8E8E8E",
    },
    completed: {
        backgroundColor: customTheme.color.intenseGreen,
    },
    error: {
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
    text: string;
    hasIssues: boolean;
    isPending: boolean;
    isCompleted: boolean;
}) {
    const { text, hasIssues, isPending, isCompleted } = props;
    const classes = useStyles();

    const buildIconClasses = React.useMemo(() => {
        const baseClasses = [classes.circle];

        if (isCompleted) {
            return [...baseClasses, classes.completed].join(" ");
        } else if (hasIssues) {
            return [...baseClasses, classes.error].join(" ");
        } else if (isPending) {
            return [...baseClasses, classes.pending].join(" ");
        } else {
            return [...baseClasses, classes.pending].join(" ");
        }
    }, [classes, hasIssues, isCompleted, isPending]);
    return <div className={buildIconClasses}>{text}</div>;
}

function buildStepsFromSections(
    analysis: QualityAnalysis,
    updateAnalysis: UpdateAnalysisState,
    currentSection: Maybe<string>,
    classes: ClassNameMap<"circle" | "pending" | "completed" | "error" | "largeIcon">
): WizardStep[] {
    const sectionSteps = _(analysis.sections)
        .map((section): Maybe<WizardStep & { id: string }> => {
            const StepComponent = getComponentFromSectionName(section.name);
            if (!StepComponent) return undefined;

            const index = analysis.sections.findIndex(s => s.id === section.id) + 1;
            const isPending = QualityAnalysisSection.isPending(section);
            const hasIssues = section.status === "success_with_issues";
            const isCompleted = section.status === "success";

            return {
                id: section.id,
                icon: (
                    <StepIcon
                        isCompleted={isCompleted}
                        isPending={isPending}
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
            };
        })
        .compact()
        .value();

    return [
        {
            key: "Configuration",
            label: i18n.t("Configuration"),
            component: () => (
                <ConfigurationStep updateAnalysis={updateAnalysis} analysis={analysis} />
            ),
            completed: false,
            icon: <SettingsIcon className={classes.largeIcon} />,
        },
        ...sectionSteps,
        {
            icon: <ListAltIcon className={classes.largeIcon} />,
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
    const loading = useLoading();
    const snackbar = useSnackbar();
    const classes = useStyles();

    const onBack = () => {
        history.push("/");
    };

    const { analysis, setAnalysis, isLoading, error } = useAnalysisById(id);

    useEffect(() => {
        if (isLoading) loading.show();
        else loading.hide();
    }, [isLoading, loading]);

    useEffect(() => {
        if (error) snackbar.error(error);
    }, [error, snackbar]);

    const analysisSteps = React.useMemo(() => {
        if (!analysis) return [];
        return buildStepsFromSections(analysis, setAnalysis, currentSection, classes);
    }, [analysis, setAnalysis, currentSection, classes]);

    const onStepChange = React.useCallback(
        (value: string) => {
            if (!analysis) return;
            const section = analysis.sections.find(s => s.name.toLowerCase() === value);
            setSection(section?.name || value);
        },
        [analysis]
    );

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
                onStepChange={onStepChange}
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
