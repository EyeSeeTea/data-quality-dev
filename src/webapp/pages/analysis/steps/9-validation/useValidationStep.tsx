import { useCallback, useEffect, useState } from "react";
import i18n from "$/utils/i18n";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import { Id } from "$/domain/entities/Ref";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { UpdateAnalysisState } from "../../AnalysisPage";

// export function useValidationStep() {
//     const validationItems = [
//         {
//             value: "ACTIVITY",
//             text: i18n.t("Activity Level"),
//         },
//         {
//             value: "SEX",
//             text: i18n.t("Sex"),
//         },
//         {
//             value: "AGE",
//             text: i18n.t("Age group"),
//         },
//         {
//             value: "BIRTH",
//             text: i18n.t("Place of Birth"),
//         },
//         {
//             value: "OWNERSHIP",
//             text: i18n.t("Ownership"),
//         },
//         {
//             value: "VACANCY",
//             text: i18n.t("Vacancy rate"),
//         },
//         {
//             value: "APPLICATIONS",
//             text: i18n.t("Applications"),
//         },
//         {
//             value: "ENROLLED",
//             text: i18n.t("Enrolled"),
//         },
//     ];

//     const [value, setValue] = useState<string>("");

//     const handleChange = (value: string | undefined) => {
//         setValue(value || "");
//     };

//     const runAnalysis = () => {
//         alert(`run analysis`);
//     };

//     return {
//         validationItems,
//         value,
//         handleChange,
//         runAnalysis,
//     };
// }

export function useValidationStep(props: UseNursingMidwiferyStepProps) {
    const { analysis, section, updateAnalysis } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const [reload, refreshReload] = useState(0);
    const [disaggregations, setDisaggregations] = useState<{ value: Id; text: string }[]>([]);
    const [selectedDisaggregations, setSelectedDissagregations] = useState<string[]>([]);

    useEffect(() => {
        loading.show(true, i18n.t("Loading"));
        compositionRoot.nursingMidwifery.getDisaggregations.execute(section.id).run(
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
    }, [section.id, compositionRoot.nursingMidwifery.getDisaggregations, loading, snackbar]);

    const handleChange = (values: string[]) => {
        setSelectedDissagregations(values);
    };

    const runAnalysis = useCallback(() => {
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
