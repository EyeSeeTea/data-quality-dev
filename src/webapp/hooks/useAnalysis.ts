import React, { useState } from "react";

import { Id } from "$/domain/entities/Ref";
import { useAppContext } from "../contexts/app-context";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";

export function useAnalysisById(props: UseAnalysisByIdProps) {
    const { id } = props;
    const { compositionRoot } = useAppContext();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [analysis, setAnalysis] = React.useState<QualityAnalysis>();
    const [error, setError] = useState<string | undefined>(undefined);

    React.useEffect(() => {
        setLoading(true);
        compositionRoot.qualityAnalysis.getById.execute(id).run(
            analysis => {
                setAnalysis(analysis);
                setLoading(false);
            },
            err => {
                setLoading(false);
                setError(err.message);
            }
        );
    }, [compositionRoot.qualityAnalysis.getById, id]);

    return { analysis, setAnalysis, isLoading, error };
}

type UseAnalysisByIdProps = { id: Id };
