import i18n from "$/utils/i18n";

export function useOutliers() {
    const algorithmItems = [
        {
            value: "READY",
            text: i18n.t("Ready"),
        },
        {
            value: "RUNNING",
            text: i18n.t("Running"),
        },
    ];

    const thresholdItems = [
        {
            value: "READY",
            text: i18n.t("Ready"),
        },
        {
            value: "RUNNING",
            text: i18n.t("Running"),
        },
    ];

    const valueChange = (e: any) => {
        alert(`Valor cambiado: ${e.target.value}`);
    };

    const runAnalysis = () => {
        alert(`run analysis`);
    };

    return {
        algorithmItems,
        thresholdItems,
        valueChange,
        runAnalysis,
    };
}
