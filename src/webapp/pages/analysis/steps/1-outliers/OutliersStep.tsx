import React from "react";
import { Dropdown, useLoading } from "@eyeseetea/d2-ui-components";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import { algorithmList, thresholdList, useAnalysisOutlier } from "./useOutliers";
import { Maybe } from "$/utils/ts-utils";
import { StepAnalysis } from "../StepAnalysis";
import { PageStepProps } from "../../AnalysisPage";

const defaultOutlierParams = { algorithm: "Z_SCORE", threshold: "3" };

export const OutliersStep: React.FC<PageStepProps> = React.memo(props => {
    const { title, analysis, section, updateAnalysis } = props;

    const [reload, refreshReload] = React.useState(0);
    const [qualityFilters, setQualityFilters] = React.useState(defaultOutlierParams);
    const loading = useLoading();
    const snackbar = useSnackbar();
    const { runAnalysisOutlier, isLoading, error } = useAnalysisOutlier({
        onSucess: qualityAnalysis => {
            refreshReload(reload + 1);
            updateAnalysis(qualityAnalysis);
        },
    });

    React.useEffect(() => {
        if (isLoading) loading.show(isLoading, i18n.t("Running analysis..."));
        else loading.hide();
    }, [isLoading, loading]);

    React.useEffect(() => {
        if (error) snackbar.error(error);
    }, [error, snackbar]);

    const runAnalysis = () => {
        runAnalysisOutlier(
            qualityFilters.algorithm,
            analysis.id,
            section.id,
            qualityFilters.threshold
        );
    };

    const onFilterChange = React.useCallback<
        (value: Maybe<string>, filterAttribute: string) => void
    >((value, filterAttribute) => {
        setQualityFilters(prev => ({ ...prev, [filterAttribute]: value }));
    }, []);

    if (!analysis) return null;

    return (
        <StepAnalysis
            id={analysis.id}
            onRun={runAnalysis}
            reload={reload}
            section={section}
            title={title}
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
