import React from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { Id } from "$/domain/entities/Ref";
import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { UpdateAnalysisState } from "../../AnalysisPage";

export function useNursingMidwiferyStep(props: UseNursingMidwiferyStepProps) {
    const { analysis, section, updateAnalysis } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const [isLoading, setLoading] = React.useState<boolean>(false);
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
    }, [section.id, compositionRoot.nursingMidwifery.getDisaggregations, snackbar]);

    const handleChange = (values: string[]) => {
        setSelectedDissagregations(values);
    };

    const runAnalysis = React.useCallback(() => {
        setLoading(true);
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
                    setLoading(false);
                },
                err => {
                    snackbar.error(err.message);
                    setLoading(false);
                }
            );
    }, [
        analysis,
        compositionRoot.nursingMidwifery.validate,
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
        isLoading,
    };
}

type UseNursingMidwiferyStepProps = {
    analysis: QualityAnalysis;
    section: QualityAnalysisSection;
    updateAnalysis: UpdateAnalysisState;
};
