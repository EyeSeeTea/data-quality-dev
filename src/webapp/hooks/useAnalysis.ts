import React, { useState } from "react";

import { Id } from "$/domain/entities/Ref";
import { useAppContext } from "../contexts/app-context";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";

export function useAnalysisById(props: UseAnalysisByIdProps) {
    const { id } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [analysis, setAnalysis] = React.useState<QualityAnalysis>();

    React.useEffect(() => {
        setLoading(true);
        compositionRoot.qualityAnalysis.getById.execute(id).run(
            analysis => {
                setAnalysis(analysis);
                setLoading(false);
            },
            err => {
                setLoading(false);
                snackbar.error(err.message);
            }
        );
    }, [compositionRoot.qualityAnalysis.getById, snackbar, id]);

    return { analysis, setAnalysis, isLoading };
}

type UseAnalysisByIdProps = { id: Id };
