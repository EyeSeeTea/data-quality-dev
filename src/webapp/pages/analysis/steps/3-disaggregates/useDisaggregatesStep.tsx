import React, { useState } from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useAppContext } from "$/webapp/contexts/app-context";
import { Id } from "$/domain/entities/Ref";
import { Option } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";
import _ from "$/domain/entities/generic/Collection";
import { UpdateAnalysisState } from "../../AnalysisPage";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";

export function useDisaggregatesStep(props: UseDisaggregatesStepProps) {
    const { analysis, sectionId, updateAnalysis } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();

    const [reload, refreshReload] = React.useState(0);
    const [isLoading, setLoading] = useState<boolean>(false);

    const [disaggregations, setDisaggregations] = React.useState<Option[]>([]);
    const [selectedDisagregations, setSelectedDisagregations] = React.useState<string[]>([]);

    React.useEffect(() => {
        compositionRoot.disaggregates.getCategoriesCombos.execute(sectionId).run(
            settingSection => {
                const initialDisaggregations = _(settingSection.disaggregations)
                    .map(disaggregation => {
                        return { value: disaggregation.id, text: disaggregation.name };
                    })
                    .sortBy(item => item.text)
                    .value();
                setDisaggregations(initialDisaggregations);
                setSelectedDisagregations(initialDisaggregations.map(item => item.value));
            },
            err => {
                snackbar.error(err.message);
            }
        );
    }, [analysis, compositionRoot.disaggregates.getCategoriesCombos, snackbar, sectionId]);

    const handleChange = (values: string[]) => {
        setSelectedDisagregations(values);
    };

    const runAnalysis = () => {
        if (!analysis) return false;
        setLoading(true);
        compositionRoot.missingDisaggregates.get
            .execute({
                analysisId: analysis.id,
                disaggregationsIds: selectedDisagregations,
                sectionId: sectionId,
            })
            .run(
                result => {
                    refreshReload(reload + 1);
                    updateAnalysis(result);
                    setLoading(false);
                },
                err => {
                    snackbar.error(err.message);
                    setLoading(false);
                }
            );
    };

    return {
        analysis,
        disaggregations,
        handleChange,
        runAnalysis,
        selectedDisagregations,
        reload,
        isLoading,
    };
}

type UseDisaggregatesStepProps = {
    analysis: QualityAnalysis;
    sectionId: Id;
    updateAnalysis: UpdateAnalysisState;
};
