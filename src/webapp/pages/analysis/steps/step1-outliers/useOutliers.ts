import React from "react";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";

export const thresholdList = [
    { value: "1", text: "1.0" },
    { value: "1.5", text: "1.5" },
    { value: "2", text: "2.0" },
    { value: "2.5", text: "2.5" },
    { value: "3", text: "3.0" },
    { value: "3.5", text: "3.5" },
    { value: "4", text: "4.0" },
    { value: "4.5", text: "4.5" },
    { value: "5", text: "5.0" },
];

export const algorithmList = [
    { value: "Z_SCORE", text: "Z-score" },
    { value: "MOD_Z_SCORE", text: "Modified Z-score" },
    { value: "MIN_MAX", text: "Minmax values" },
];

export function useAnalysisOutlier(props: UseRunAnalysisProps) {
    const { onSucess } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const runAnalysisOutlier = React.useCallback(
        (algorithm: string, id: string, threshold: string) => {
            loading.show(true, i18n.t("Running analysis..."));
            compositionRoot.outlier.run
                .execute({ algorithm: algorithm, qualityAnalysisId: id, threshold: threshold })
                .run(
                    qualityAnalysis => {
                        loading.hide();
                        onSucess(qualityAnalysis);
                    },
                    err => {
                        snackbar.error(err.message);
                        loading.hide();
                    }
                );
        },
        [compositionRoot.outlier.run, loading, snackbar, onSucess]
    );

    return { runAnalysisOutlier };
}

type UseRunAnalysisProps = { onSucess: (qualityAnalysis: QualityAnalysis) => void };
