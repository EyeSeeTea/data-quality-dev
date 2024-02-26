import React from "react";
import { Dropdown } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import _, { Collection } from "$/domain/entities/generic/Collection";
import { Module } from "$/domain/entities/Module";
import { qualityAnalysisStatus } from "$/domain/entities/QualityAnalysisStatus";
import { Maybe } from "$/utils/ts-utils";

const currentYear = new Date().getFullYear();

function buildPeriods() {
    return Collection.range(currentYear - 5, currentYear)
        .map(period => {
            return { value: period.toString(), text: period.toString() };
        })
        .reverse()
        .value();
}

type AnalysisFiltersProps = {
    modules: Module[];
    initialFilters: AnalysisFilterState;
    onChange: React.Dispatch<React.SetStateAction<AnalysisFilterState>>;
};

export const AnalysisFilters: React.FC<AnalysisFiltersProps> = props => {
    const { modules, initialFilters, onChange } = props;

    const periods = buildPeriods();

    const modulesFilters = modules.map(module => {
        return { value: module.id, text: module.name };
    });

    const analysisStatus = qualityAnalysisStatus.map(status => {
        return { value: status, text: status };
    });

    const onFilterChange = React.useCallback<
        (value: Maybe<string>, filterAttribute: string) => void
    >(
        (value, filterAttribute) => {
            onChange(prev => ({ ...prev, [filterAttribute]: value }));
        },
        [onChange]
    );

    return (
        <>
            <Dropdown
                items={modulesFilters}
                onChange={value => onFilterChange(value, "module")}
                value={initialFilters.module}
                label={i18n.t("Dataset")}
            />
            <Dropdown
                items={periods}
                onChange={value => onFilterChange(value, "startDate")}
                value={initialFilters.startDate}
                label={i18n.t("Start Date")}
            />
            <Dropdown
                items={periods}
                onChange={value => onFilterChange(value, "endDate")}
                value={initialFilters.endDate}
                label={i18n.t("End Date")}
            />
            <Dropdown
                items={analysisStatus}
                onChange={value => onFilterChange(value, "status")}
                value={initialFilters.status}
                label={i18n.t("Status")}
            />
        </>
    );
};

export type AnalysisFilterState = {
    endDate: Maybe<string>;
    module: Maybe<string>;
    name: Maybe<string>;
    startDate: Maybe<string>;
    status: Maybe<string>;
};

export const initialFilters: AnalysisFilterState = {
    endDate: undefined,
    module: undefined,
    name: undefined,
    startDate: undefined,
    status: undefined,
};
