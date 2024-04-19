import React from "react";
import i18n from "$/utils/i18n";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { UpdateAnalysisState } from "$/webapp/pages/analysis/AnalysisPage";
import { Maybe } from "$/utils/ts-utils";

export function useValidationStep(props: UseValidationStepProps) {
    const { analysis, section, updateAnalysis } = props;
    const { compositionRoot, validationRuleGroups } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const [reload, refreshReload] = React.useState(0);
    const [selectedValidationRule, setSelectedValidationRule] = React.useState<Maybe<string>>("");

    const handleChange = (value: Maybe<string>) => {
        setSelectedValidationRule(value);
    };

    const runAnalysis = React.useCallback(() => {
        loading.show(true, i18n.t("Running analysis..."));
        compositionRoot.validationRules.run
            .execute({
                qualityAnalysisId: analysis.id,
                validationRuleGroupId: selectedValidationRule || "",
                sectionId: section.id,
            })
            .run(
                analysis => {
                    refreshReload(reload + 1);
                    updateAnalysis(analysis);
                    loading.show(false);
                },
                err => {
                    snackbar.error(err.message);
                    loading.show(false);
                }
            );
    }, [
        loading,
        compositionRoot.validationRules.run,
        analysis.id,
        selectedValidationRule,
        section.id,
        reload,
        updateAnalysis,
        snackbar,
    ]);

    const validationRulesOptions = React.useMemo(() => {
        return validationRuleGroups.map(validationRuleGroup => {
            return { text: validationRuleGroup.name, value: validationRuleGroup.id };
        });
    }, [validationRuleGroups]);

    return {
        analysis,
        reload,
        validationRules: validationRulesOptions,
        handleChange,
        runAnalysis,
        selectedValidationRule,
        setSelectedValidationRule,
    };
}

type UseValidationStepProps = {
    analysis: QualityAnalysis;
    section: QualityAnalysisSection;
    updateAnalysis: UpdateAnalysisState;
};
