import React from "react";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { Id } from "$/domain/entities/Ref";
import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { UpdateAnalysisState } from "$/webapp/pages/analysis/AnalysisPage";

export function useNursingMidwiferyStep(props: UseNursingMidwiferyStepProps) {
    const { analysis, section, updateAnalysis } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const [reload, refreshReload] = React.useState(0);
    const [disaggregations, setDisaggregations] = React.useState<{ value: Id; text: string }[]>([]);
    const [selectedDisaggregations, setSelectedDissagregations] = React.useState<string[]>([]);

    React.useEffect(() => {
        compositionRoot.nursingMidwifery.getDisaggregations.execute(section.id).run(
            result => {
                const selectedDisaggregations = result.map(item => ({
                    value: item.id,
                    text: item.name,
                }));
                setDisaggregations(selectedDisaggregations);
                setSelectedDissagregations(selectedDisaggregations.map(item => item.value));
            },
            error => {
                snackbar.error(error.message);
            }
        );
    }, [section.id, compositionRoot.nursingMidwifery.getDisaggregations, loading, snackbar]);

    const handleChange = (values: string[]) => {
        setSelectedDissagregations(values);
    };

    const runAnalysis = React.useCallback(() => {
        loading.show(true, i18n.t("Running analysis..."));
        compositionRoot.nursingMidwifery.validate
            .execute({
                analysisId: analysis.id,
                disaggregationsIds: selectedDisaggregations,
                sectionId: section.id,
            })
            .run(
                analysis => {
                    refreshReload(reload + 1);
                    updateAnalysis(analysis);
                    loading.hide();
                },
                err => {
                    snackbar.error(err.message);
                    loading.hide();
                }
            );
    }, [
        analysis,
        compositionRoot.nursingMidwifery.validate,
        loading,
        reload,
        updateAnalysis,
        snackbar,
        selectedDisaggregations,
        section.id,
    ]);

    return {
        analysis,
        reload,
        disaggregations,
        selectedDisaggregations,
        handleChange,
        runAnalysis,
    };
}

type UseNursingMidwiferyStepProps = {
    analysis: QualityAnalysis;
    section: QualityAnalysisSection;
    updateAnalysis: UpdateAnalysisState;
};
