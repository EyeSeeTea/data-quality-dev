import React from "react";
import { Dropdown } from "@eyeseetea/d2-ui-components";
import { useParams } from "react-router-dom";

import i18n from "$/utils/i18n";
import { useAnalysisById } from "$/webapp/hooks/useAnalysis";
import { algorithmList, thresholdList, useAnalysisOutlier } from "./useOutliers";
import { Maybe } from "$/utils/ts-utils";
import { outlierKey } from "../../steps";
import { StepAnalysis } from "../StepAnalysis";

const defaultOutlierParams = { algorithm: "Z_SCORE", threshold: "3" };

export const OutliersStep: React.FC<PageProps> = React.memo(() => {
    const params = useParams<{ id: string }>();
    const [reload, refreshReload] = React.useState(0);
    const [qualityFilters, setQualityFilters] = React.useState(defaultOutlierParams);

    const { analysis, setAnalysis } = useAnalysisById({ id: params.id });

    const section = analysis?.sections.find(section => section.name === outlierKey);

    const { runAnalysisOutlier } = useAnalysisOutlier({
        onSucess: qualityAnalysis => {
            refreshReload(reload + 1);
            setAnalysis(qualityAnalysis);
        },
    });

    const runAnalysis = () => {
        runAnalysisOutlier(qualityFilters.algorithm, params.id, qualityFilters.threshold);
    };

    const onFilterChange = React.useCallback<
        (value: Maybe<string>, filterAttribute: string) => void
    >((value, filterAttribute) => {
        setQualityFilters(prev => ({ ...prev, [filterAttribute]: value }));
    }, []);

    if (!analysis || !section) return null;

    return (
        <StepAnalysis
            id={analysis.id}
            onRun={runAnalysis}
            reload={reload}
            section={section}
            title={i18n.t(
                "Outliers detection analysis based on DHIS2 min-max standard functionality"
            )}
        >
            <Dropdown
                hideEmpty
                items={algorithmList}
                onChange={value => onFilterChange(value, "algorithm")}
                value={qualityFilters.algorithm}
                label={i18n.t("Algorithm")}
            />
            <Dropdown
                hideEmpty
                items={thresholdList}
                onChange={value => onFilterChange(value, "threshold")}
                value={qualityFilters.threshold}
                label={i18n.t("Threshold")}
            />
        </StepAnalysis>
    );
});

type PageProps = { title: string };
