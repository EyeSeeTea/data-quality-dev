import React from "react";
import i18n from "$/utils/i18n";
import { ConfigurationForm } from "$/webapp/components/configuration-form/ConfigurationForm";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { useAnalysisById } from "$/webapp/hooks/useAnalysis";
import { useParams } from "react-router-dom";
import { useAnalysisMethods } from "$/webapp/hooks/useQualityAnalysisTable";
import { useAppContext } from "$/webapp/contexts/app-context";
import { Settings } from "$/domain/entities/Settings";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";

const noop = () => {};

export function useConfigData() {
    const { compositionRoot } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();
    const [settings, setSettings] = React.useState<Settings>();
    React.useEffect(() => {
        loading.show();
        compositionRoot.settings.get.execute().run(
            settings => {
                setSettings(settings);
                loading.hide();
            },
            err => {
                snackbar.error(err.message);
                loading.hide();
            }
        );
    }, [compositionRoot.settings.get, loading, snackbar]);

    return { settings };
}

export const ConfigurationStep: React.FC<{}> = React.memo(() => {
    const { id } = useParams<{ id: string }>();
    const { analysis } = useAnalysisById({ id: id });
    const { saveQualityAnalysis } = useAnalysisMethods({
        onSuccess: noop,
        onRemove: noop,
    });
    const { settings } = useConfigData();

    const onSave = React.useCallback(
        (analysisToUpdate: QualityAnalysis) => {
            saveQualityAnalysis(analysisToUpdate);
        },
        [saveQualityAnalysis]
    );

    if (!analysis) return null;

    return (
        <div>
            <h2>{i18n.t("Configuration")}</h2>
            <ConfigurationForm
                initialCountries={settings?.countryIds || []}
                initialData={analysis}
                onSave={analysis => onSave(analysis)}
            />
        </div>
    );
});
