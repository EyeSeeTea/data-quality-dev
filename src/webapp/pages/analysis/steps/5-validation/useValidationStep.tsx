import React from "react";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { UpdateAnalysisState } from "../../AnalysisPage";
import { Maybe } from "$/utils/ts-utils";

export function useValidationStep(props: UseValidationStepProps) {
    const { analysis, section, updateAnalysis } = props;
    const { compositionRoot, validationRuleGroups } = useAppContext();
    const snackbar = useSnackbar();
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [reload, refreshReload] = React.useState(0);
    const [selectedValidationRule, setSelectedValidationRule] = React.useState<Maybe<string>>("");

    const handleChange = (value: Maybe<string>) => {
        setSelectedValidationRule(value);
    };

    const runAnalysis = React.useCallback(() => {
        setLoading(true);
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
                    setLoading(false);
                },
                err => {
                    snackbar.error(err.message);
                    setLoading(false);
                }
            );
    }, [
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
        isLoading,
    };
}

type UseValidationStepProps = {
    analysis: QualityAnalysis;
    section: QualityAnalysisSection;
    updateAnalysis: UpdateAnalysisState;
};
