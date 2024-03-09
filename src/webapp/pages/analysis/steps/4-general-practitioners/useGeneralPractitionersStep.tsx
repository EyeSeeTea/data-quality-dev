import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useAnalysisById } from "$/webapp/hooks/useAnalysis";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import React from "react";

const doubleCountsList = [
    {
        value: "1",
        text: "+/- 1%",
    },
    {
        value: "2",
        text: "+/- 2%",
    },
    {
        value: "3",
        text: "+/- 3%",
    },
    {
        value: "4",
        text: "+/- 4%",
    },
    {
        value: "5",
        text: "+/- 5%",
    },
];

export function useGeneralPractitionersStep(props: UseGeneralPractitionersStepProps) {
    const { analysisId } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const [reload, refreshReload] = React.useState(0);
    const { analysis, setAnalysis } = useAnalysisById({ id: analysisId });
    const [disaggregations, setDisaggregations] = React.useState<{ value: Id; text: string }[]>([]);
    const [selectedDisaggregations, setSelectedDissagregations] = React.useState<string[]>([]);
    const [threshold, setThreshold] = React.useState<string>("1");

    const handleChange = (values: string[]) => {
        setSelectedDissagregations(values);
    };

    const valueChange = (value: string | undefined) => {
        if (value) {
            setThreshold(value);
        }
    };

    React.useEffect(() => {
        if (!analysis?.module.id) return;

        compositionRoot.modules.getDisaggregations.execute(analysis.module.id).run(
            disaggregations => {
                const initialDisaggregations = disaggregations.map(disaggregation => {
                    return {
                        value: disaggregation.id,
                        text: disaggregation.name,
                    };
                });
                setDisaggregations(initialDisaggregations);
                setSelectedDissagregations(initialDisaggregations.map(item => item.value));
            },
            err => {
                snackbar.error(err.message);
            }
        );
    }, [analysis?.module.id, compositionRoot.modules.getDisaggregations, snackbar]);

    const runAnalysis = React.useCallback(() => {
        if (!analysis) return false;
        loading.show(true, i18n.t("Running analysis..."));
        compositionRoot.practitioners.run
            .execute({
                analysisId: analysis.id,
                threshold: Number(threshold),
                dissagregationsIds: selectedDisaggregations,
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
        compositionRoot.practitioners.run,
        loading,
        reload,
        setAnalysis,
        snackbar,
        threshold,
        selectedDisaggregations,
    ]);

    return {
        analysis,
        disaggregations,
        doubleCountsList,
        handleChange,
        runAnalysis,
        reload,
        selectedDisaggregations,
        setAnalysis,
        valueChange,
        threshold,
    };
}

type UseGeneralPractitionersStepProps = {
    analysisId: Id;
};
