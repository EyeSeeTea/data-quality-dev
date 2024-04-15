import React from "react";

import { Id } from "$/domain/entities/Ref";
import { useAppContext } from "../contexts/app-context";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import i18n from "$/utils/i18n";

export function useAnalysisById(props: UseAnalysisByIdProps) {
    const { id } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const loading = useLoading();
    const [analysis, setAnalysis] = React.useState<QualityAnalysis>();

    React.useEffect(() => {
        loading.show(true, i18n.t("Loading Analysis..."));
        compositionRoot.qualityAnalysis.getById.execute(id).run(
            analysis => {
                setAnalysis(analysis);
                loading.hide();
            },
            err => {
                loading.hide();
                snackbar.error(err.message);
            }
        );
    }, [compositionRoot.qualityAnalysis.getById, loading, snackbar, id]);

    return { analysis, setAnalysis };
}

type UseAnalysisByIdProps = { id: Id };
