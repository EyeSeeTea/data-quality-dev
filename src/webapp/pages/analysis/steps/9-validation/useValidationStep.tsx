import { useCallback, useEffect, useState } from "react";
import i18n from "$/utils/i18n";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { UpdateAnalysisState } from "../../AnalysisPage";
import { ValidationRuleGroup } from "$/domain/entities/ValidationRuleGroup";

export function useValidationStep(props: UseValidationStepProps) {
    const { analysis, section, updateAnalysis } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const [reload, refreshReload] = useState(0);
    const [validationRules, setValidationRules] = useState<{ value: string; text: string }[]>([]);
    const [selectedValidationRule, setSelectedValidationRule] = useState<string | undefined>("");

    useEffect(() => {
        loading.show(true, i18n.t("Loading"));

        const fetchData = async () => {
            compositionRoot.validationRules.get.execute().run(
                (items: ValidationRuleGroup[]) => {
                    const finalItems = items.map(item => ({
                        value: item.id.toString(),
                        text: item.name,
                    }));
                    setValidationRules(finalItems);
                    loading.show(false);
                },
                error => {
                    loading.show(false);
                    snackbar.error(error.message);
                }
            );
        };
        fetchData();
    }, [section.id, compositionRoot.validationRules.get, loading, snackbar]);

    const handleChange = (value: string | undefined) => {
        setSelectedValidationRule(value);
    };

    const runAnalysis = useCallback(() => {
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

    return {
        analysis,
        reload,
        validationRules,
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
