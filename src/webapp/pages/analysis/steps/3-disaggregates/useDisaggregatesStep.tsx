import React from "react";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useAnalysisById } from "$/webapp/hooks/useAnalysis";
import { Id } from "$/domain/entities/Ref";
import { Option } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";
import { disaggregateKey } from "../../steps";
import _ from "$/domain/entities/generic/Collection";

export function useDisaggregatesStep(props: UseDisaggregatesStepProps) {
    const { analysisId } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const [reload, refreshReload] = React.useState(0);
    const { analysis, setAnalysis } = useAnalysisById({ id: analysisId });
    const [disaggregations, setDisaggregations] = React.useState<Option[]>([]);
    const [selectedDisagregations, setSelectedDisagregations] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!analysis) return;

        const section = analysis.sections.find(section => section.name === disaggregateKey);

        compositionRoot.disaggregates.getCategoriesCombos.execute(section?.name || "").run(
            settingSection => {
                const initialDisaggregations =
                    _(settingSection.disaggregations)
                        .map(disaggregation => {
                            return {
                                value: disaggregation.id,
                                text: disaggregation.name,
                            };
                        })
                        .sortBy(item => item.text)
                        .value() || [];
                setDisaggregations(initialDisaggregations);
                setSelectedDisagregations(initialDisaggregations.map(item => item.value));
            },
            err => {
                snackbar.error(err.message);
            }
        );
    }, [analysis, compositionRoot.disaggregates.getCategoriesCombos, snackbar]);

    const handleChange = (values: string[]) => {
        setSelectedDisagregations(values);
    };

    const runAnalysis = () => {
        if (!analysis) return false;
        loading.show(true, i18n.t("Running analysis..."));
        compositionRoot.missingDisaggregates.get
            .execute({ analysisId: analysis.id, disaggregationsIds: selectedDisagregations })
            .run(
                result => {
                    refreshReload(reload + 1);
                    setAnalysis(result);
                    loading.hide();
                },
                err => {
                    snackbar.error(err.message);
                    loading.hide();
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
    };
}

type UseDisaggregatesStepProps = { analysisId: Id };
