import React from "react";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { useAnalysisById } from "$/webapp/hooks/useAnalysis";
import { Id } from "$/domain/entities/Ref";
import { useAppContext } from "$/webapp/contexts/app-context";
import { missingNursing } from "../../steps";

export function useNursingMidwiferyStep(props: UseNursingMidwiferyStepProps) {
    const { analysisId } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const [reload, refreshReload] = React.useState(0);
    const { analysis, setAnalysis } = useAnalysisById({ id: analysisId });
    const [disaggregations, setDisaggregations] = React.useState<{ value: Id; text: string }[]>([]);
    const [selectedDisaggregations, setSelectedDissagregations] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!analysis) return;
        const section = analysis?.sections.find(section => section.name === missingNursing);
        if (!section) return;

        loading.show(true, i18n.t("Loading"));
        compositionRoot.nursingMidwifery.getDisaggregations.execute(section.name).run(
            result => {
                const selectedDisaggregations = result.map(item => ({
                    value: item.id,
                    text: item.name,
                }));
                setDisaggregations(selectedDisaggregations);
                setSelectedDissagregations(selectedDisaggregations.map(item => item.value));
                loading.hide();
            },
            error => {
                loading.hide();
                snackbar.error(error.message);
            }
        );
    }, [analysis, compositionRoot.nursingMidwifery.getDisaggregations, loading, snackbar]);

    const handleChange = (values: string[]) => {
        setSelectedDissagregations(values);
    };

    const runAnalysis = React.useCallback(() => {
        if (!analysis) return false;
        const section = analysis?.sections.find(section => section.name === missingNursing);
        if (!section) return false;
        loading.show(true, i18n.t("Running analysis..."));
        compositionRoot.nursingMidwifery.validate
            .execute({
                analysisId: analysis.id,
                disaggregationsIds: selectedDisaggregations,
                sectionId: section.name,
            })
            .run(
                analysis => {
                    refreshReload(reload + 1);
                    setAnalysis(analysis);
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
        setAnalysis,
        snackbar,
        selectedDisaggregations,
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

type UseNursingMidwiferyStepProps = { analysisId: Id };
