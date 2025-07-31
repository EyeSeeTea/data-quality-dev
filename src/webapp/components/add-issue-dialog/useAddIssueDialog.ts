import React from "react";

import { useAppContext } from "$/webapp/contexts/app-context";
import { Id } from "$/domain/entities/Ref";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { DataElement } from "$/domain/entities/DataElement";
import _ from "$/domain/entities/generic/Collection";
import { Maybe } from "$/utils/ts-utils";

type UseAddIssueDialogProps = {
    analysis: QualityAnalysis;
};

export function useAddIssueDialog(props: UseAddIssueDialogProps) {
    const { analysis } = props;
    const { compositionRoot } = useAppContext();
    const snackBar = useSnackbar();

    const [addIssueForm, updateAddIssueForm] = React.useState<AddIssueForm>({
        orgUnits: [],
        periods: [],
        dataElement: "",
        categoryOptions: [],
    });
    const [dataElements, setDataElements] = React.useState<DataElement[]>([]);

    const dataElementOptions = React.useMemo(
        () =>
            _(dataElements)
                .sortBy(dataElement => dataElement.name)
                .map(({ name, id }) => ({ text: name, value: id }))
                .value(),
        [dataElements]
    );
    const dataElementsMap = React.useMemo(
        () => _(dataElements).keyBy(dataElement => dataElement.id),
        [dataElements]
    );
    const categoryOptionOptions = React.useMemo(() => {
        if (addIssueForm.dataElement) {
            return (
                dataElementsMap
                    .get(addIssueForm.dataElement)
                    ?.disaggregation?.options.map(({ id, name }) => ({ text: name, value: id })) ??
                []
            );
        } else {
            return [];
        }
    }, [dataElementsMap, addIssueForm]);

    const periodOptions = React.useMemo(() => {
        const { startDate, endDate } = analysis;
        const startYear = parseInt(startDate);
        const endYear = parseInt(endDate);
        const yearCount = endYear - startYear + 1;

        return Array.from({ length: yearCount }, (_, i) => {
            const year = (startYear + i).toString();
            return { value: year, text: year };
        });
    }, [analysis]);

    const updateForm = React.useCallback(
        (field: keyof AddIssueForm) => (value: Maybe<Id[]>) => {
            const newValue = field === "dataElement" && value ? value[0] : value;
            updateAddIssueForm(prev => ({
                ...prev,
                [field]: newValue,
            }));
        },
        []
    );

    React.useEffect(() => {
        compositionRoot.modules.get.execute([analysis.module.id]).run(
            modules => {
                const module = modules[0];
                if (module) {
                    setDataElements(module.dataElements);
                    console.log(module);
                }
            },
            err => {
                snackBar.error(err.message);
            }
        );
    }, [compositionRoot, analysis, snackBar]);

    return {
        addIssueForm,
        updateForm,
        dataElementOptions,
        categoryOptionOptions,
        periodOptions,
    };
}

type AddIssueForm = {
    orgUnits: Id[];
    periods: Id[];
    dataElement: Maybe<Id>;
    categoryOptions: Id[];
};
