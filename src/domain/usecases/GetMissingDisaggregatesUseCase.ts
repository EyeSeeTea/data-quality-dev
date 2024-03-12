import _ from "lodash";

import { FutureData } from "$/data/api-futures";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { Id } from "$/domain/entities/Ref";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";
import { UCAnalysis } from "$/domain/usecases/common/UCAnalysis";
import { Future } from "$/domain/entities/generic/Future";
import { DataValueRepository } from "$/domain/repositories/DataValueRepository";
import { IssueRepository } from "$/domain/repositories/IssueRepository";
import { UCDataValue } from "$/domain/usecases/common/UCDataValue";
import { DataElement } from "$/domain/entities/DataElement";
import { DataValue } from "$/domain/entities/DataValue";
import { Maybe } from "$/utils/ts-utils";
import { UCIssue } from "./common/UCIssue";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { MissingDisaggregates } from "$/domain/entities/MissingDisaggregates";
import { getCurrentSection } from "./common/utils";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { SectionDisaggregation, SectionSetting, Settings } from "$/domain/entities/Settings";
import { MissingComboValue } from "$/domain/entities/MissingComboValue";
import { disaggregateKey } from "$/webapp/pages/analysis/steps";

const separator = " - ";
export class GetMissingDisaggregatesUseCase {
    analysisUseCase: UCAnalysis;
    issueUseCase: UCIssue;
    dataValueUseCase: UCDataValue;
    constructor(
        private analysisRepository: QualityAnalysisRepository,
        private moduleRepository: ModuleRepository,
        private dataValueRepository: DataValueRepository,
        private issueRepository: IssueRepository,
        private settingsRepository: SettingsRepository
    ) {
        this.analysisUseCase = new UCAnalysis(this.analysisRepository);
        this.dataValueUseCase = new UCDataValue(this.dataValueRepository);
        this.issueUseCase = new UCIssue(this.issueRepository);
    }
    execute(options: GetMissingDisaggregatesOptions): FutureData<QualityAnalysis> {
        return Future.joinObj({
            analysis: this.analysisUseCase.getById(options.analysisId),
            settings: this.settingsRepository.get(),
        }).flatMap(({ analysis, settings }) => {
            return this.getDisaggregatesValues(analysis, settings, options);
        });
    }

    private getDisaggregatesValues(
        analysis: QualityAnalysis,
        settings: Settings,
        options: GetMissingDisaggregatesOptions
    ): FutureData<QualityAnalysis> {
        return this.getDataElementsWithValues(analysis, options, settings).flatMap(result => {
            const { dataValues, dataElements } = result;

            const missingValues = this.buildDisaggregatesValues(
                dataValues,
                dataElements,
                settings,
                options
            );

            return this.issueUseCase
                .getTotalIssuesBySection(analysis, disaggregateKey)
                .flatMap(totalIssues => {
                    const missingDisaggregateValues = missingValues.flatMap(missingValue =>
                        missingValue.type === "dataElements" ? missingValue.values : []
                    );

                    const missingComboValues = missingValues.flatMap(missingValue =>
                        missingValue.type === "combos" ? missingValue.values : []
                    );

                    const issues = this.createIssuesFromMissingAggregate(
                        missingDisaggregateValues as MissingDisaggregates[],
                        analysis,
                        totalIssues
                    );

                    const issues2 = this.createIssuesFromMissingCombos(
                        missingComboValues as MissingComboValue[],
                        analysis,
                        totalIssues + issues.length
                    );

                    const allIssues = [...issues, ...issues2];

                    return this.issueUseCase.save(allIssues, analysis.id).flatMap(() => {
                        const analysisUpdate = this.analysisUseCase.updateAnalysis(
                            analysis,
                            disaggregateKey,
                            allIssues.length
                        );
                        return this.analysisRepository.save([analysisUpdate]).flatMap(() => {
                            return Future.success(analysisUpdate);
                        });
                    });
                });
        });
    }

    private createIssuesFromMissingAggregate(
        missingValues: MissingDisaggregates[],
        analysis: QualityAnalysis,
        totalIssues: number
    ): QualityAnalysisIssue[] {
        const section = getCurrentSection(analysis, disaggregateKey);

        const onlyMissing = missingValues.filter(missingValue => missingValue.hasMissingValues);
        let acumulativeIssueNumber = totalIssues;

        return _(onlyMissing)
            .map((missingDisaggregate): QualityAnalysisIssue[] => {
                const missingCombinations =
                    MissingDisaggregates.getMissingCombinations(missingDisaggregate);
                const disaggregationFromDataElement =
                    missingDisaggregate.dataElement.name.split(separator)[2];

                const issues = missingCombinations.map((missingCombination, index) => {
                    const currentNumber = acumulativeIssueNumber + (index + 1);
                    const prefix = `${analysis.sequential.value}-S03`;
                    const issueNumber = this.issueUseCase.generateIssueNumber(
                        currentNumber,
                        prefix
                    );

                    const disaggregationName =
                        disaggregationFromDataElement || missingDisaggregate.disaggregation.name;

                    return this.issueUseCase.buildDefaultIssue(
                        {
                            categoryOptionComboId: missingCombination.id,
                            period: missingDisaggregate.period,
                            countryId: missingDisaggregate.countryId,
                            dataElementId: missingDisaggregate.dataElement.id,
                            description: `A missing disaggregate was detected for the Category ${disaggregationName}. Missing value was ${missingCombination.name}.`,
                            issueNumber: issueNumber,
                            correlative: String(currentNumber),
                        },
                        section.id
                    );
                });
                acumulativeIssueNumber += issues.length;
                return issues;
            })
            .flatten()
            .value();
    }

    private createIssuesFromMissingCombos(
        missingValues: MissingComboValue[],
        analysis: QualityAnalysis,
        totalIssues: number
    ): QualityAnalysisIssue[] {
        const section = getCurrentSection(analysis, disaggregateKey);

        const onlyMissing = missingValues.filter(missingValue => missingValue.hasMissingValues);

        let acumulativeIssueNumber = totalIssues;

        return _(onlyMissing)
            .map((missingCombo): QualityAnalysisIssue[] => {
                const missingDataElements = MissingComboValue.getMissingCombinations(missingCombo);

                const issues = missingDataElements.map((missingDataElement, index) => {
                    const currentNumber = acumulativeIssueNumber + (index + 1);
                    const prefix = `${analysis.sequential.value}-S03`;
                    const issueNumber = this.issueUseCase.generateIssueNumber(
                        currentNumber,
                        prefix
                    );
                    const disaggregationName = missingCombo.disaggregation.name;

                    return this.issueUseCase.buildDefaultIssue(
                        {
                            categoryOptionComboId: missingCombo.combination.id,
                            period: missingCombo.period,
                            countryId: missingCombo.countryId,
                            dataElementId: missingDataElement.id,
                            description: `A missing disaggregate was detected for the Category ${disaggregationName}. Missing value was ${missingDataElement.name}.`,
                            issueNumber: issueNumber,
                            correlative: String(currentNumber),
                        },
                        section.id
                    );
                });

                acumulativeIssueNumber += issues.length;

                return issues;
            })
            .flatten()
            .value();
    }

    private buildDisaggregatesValues(
        dataValues: Record<string, DataValue[]>,
        dataElements: DataElement[],
        settings: Settings,
        options: GetMissingDisaggregatesOptions
    ): MissingValues[] {
        const keys = _(dataValues).keys().value();

        const sectionSetting = this.getSectionSetting(settings);
        const selectedDisaggregations = sectionSetting.disaggregations.filter(disaggregation => {
            return options.disaggregationsIds.includes(disaggregation.id);
        });

        return _(keys)
            .flatMap(key => {
                const dvCountryPeriod = dataValues[key];
                const [countryId, period] = key.split(".");
                if (!countryId || !period) {
                    throw Error(`Cannot found country or period: ${key}`);
                }
                if (!dvCountryPeriod) return [];

                const result = _(selectedDisaggregations)
                    .map((disaggregationSetting): MissingValues => {
                        const deByDisaggregation = this.getDataElementsByDisaggregationType(
                            disaggregationSetting,
                            dataElements
                        );

                        if (disaggregationSetting.type === "combos") {
                            const missingCombinationValues = this.getMissingCombinationValues(
                                disaggregationSetting,
                                deByDisaggregation,
                                dvCountryPeriod,
                                period,
                                countryId
                            );
                            return { type: "combos", values: missingCombinationValues };
                        } else {
                            const missingDisa = this.getMissingDataElementValues(
                                deByDisaggregation,
                                dvCountryPeriod,
                                selectedDisaggregations,
                                countryId,
                                period
                            );
                            return { type: "dataElements", values: missingDisa };
                        }
                    })
                    .value();

                return result;
            })
            .value();
    }

    private getMissingDataElementValues(
        deByDisaggregation: DataElement[],
        dvCountryPeriod: DataValue[],
        selectedDisaggregations: SectionDisaggregation[],
        countryId: string,
        period: string
    ): MissingDisaggregates[] {
        return _(deByDisaggregation)
            .map((dataElement): Maybe<MissingDisaggregates> => {
                const { id, disaggregation } = dataElement;
                if (!disaggregation) return undefined;
                const combinations = disaggregation?.options.map(option => option) || [];

                const combinationValues = _(combinations)
                    .map(combination => {
                        const combinationValue = dvCountryPeriod.find(
                            dataValue =>
                                dataValue.categoryOptionComboId === combination.id &&
                                dataValue.dataElementId === id
                        );
                        return { ...combination, dataValue: combinationValue };
                    })
                    .value();

                const combinationsToInclude =
                    selectedDisaggregations.find(d => d.id === disaggregation.id)?.combinations ||
                    [];

                return MissingDisaggregates.build({
                    combinations: combinationValues,
                    countryId: countryId,
                    period: period,
                    dataElement: dataElement,
                    disaggregation: disaggregation,
                    hasMissingValues: false,
                    combinationsToInclude: combinationsToInclude,
                });
            })
            .compact()
            .value();
    }

    private getMissingCombinationValues(
        settings: SectionDisaggregation,
        deByDisaggregation: DataElement[],
        dvCountryPeriod: DataValue[],
        period: string,
        countryId: string
    ): MissingComboValue[] {
        const allCombinations = _(deByDisaggregation)
            .flatMap(dataElement => dataElement.disaggregation?.options || [])
            .uniqBy(combination => combination.id)
            .value();

        return allCombinations.map((combination): MissingComboValue => {
            const values = deByDisaggregation.map(dataElement => {
                const dataValue = dvCountryPeriod.find(
                    dataValue =>
                        dataValue.categoryOptionComboId === combination.id &&
                        dataElement.id === dataValue.dataElementId
                );
                return {
                    ...dataElement,
                    name: _(dataElement.name).split(separator).nth(1) || "",
                    dataValue: dataValue,
                };
            });

            return MissingComboValue.build({
                period,
                countryId,
                combination,
                dataElements: values,
                disaggregation: { id: settings.disaggregationId, name: settings.name },
                dataElementsToInclude: settings.combinations?.map(combination => combination) || [],
                hasMissingValues: false,
            });
        });
    }

    private getDataElementsByDisaggregationType(
        disaggregationSetting: SectionDisaggregation,
        dataElements: DataElement[]
    ) {
        if (disaggregationSetting.type === "combos") {
            return dataElements.filter(de => {
                return (
                    de.name.split(separator)[0] === disaggregationSetting.id &&
                    de.disaggregation?.id === disaggregationSetting.disaggregationId
                );
            });
        } else {
            return dataElements.filter(de => {
                return de.disaggregation?.id === disaggregationSetting.id;
            });
        }
    }

    private getDataElementsWithValues(
        analysis: QualityAnalysis,
        options: GetMissingDisaggregatesOptions,
        settings: Settings
    ): FutureData<{ dataValues: Record<string, DataValue[]>; dataElements: DataElement[] }> {
        const { module } = analysis;
        const sectionSetting = this.getSectionSetting(settings);
        const selectedDisaggregations = sectionSetting.disaggregations.filter(disaggregation => {
            return options.disaggregationsIds.includes(disaggregation.id);
        });
        return this.getDataElements(module.id, selectedDisaggregations).flatMap(dataElements => {
            const dataElementsByKey = _(dataElements)
                .keyBy(de => de.id)
                .value();

            return this.getDataValues(analysis).flatMap(dataValues => {
                const filteredDataValues = dataValues.filter(dataValue =>
                    Boolean(dataElementsByKey[dataValue.dataElementId])
                );
                const dataValuesByCountryAndPeriod =
                    this.dataValueUseCase.getByCountryAndPeriod(filteredDataValues);

                return Future.success({
                    dataValues: dataValuesByCountryAndPeriod,
                    dataElements: dataElements,
                });
            });
        });
    }

    private getDataElements(
        moduleId: Id,
        selectedDisaggregations: SectionDisaggregation[]
    ): FutureData<DataElement[]> {
        return this.moduleRepository.getByIds([moduleId]).flatMap(modules => {
            const module = modules[0];
            if (!module) return Future.error(new Error(`Module not found: ${moduleId}`));

            const dataElements = _(module.dataElements)
                .map(dataElement => {
                    const deDisaggregation = dataElement.disaggregation;
                    if (!deDisaggregation) return undefined;

                    const disaggregation = selectedDisaggregations.find(disaggregation => {
                        if (disaggregation.type === "combos") {
                            const disaggregationFromName = dataElement.name.split(separator)[0];
                            return (
                                disaggregation.disaggregationId === deDisaggregation.id &&
                                disaggregationFromName === disaggregation.id
                            );
                        } else {
                            return disaggregation.id === deDisaggregation.id;
                        }
                    });
                    if (!disaggregation) return undefined;

                    return disaggregation ? dataElement : undefined;
                })
                .compact()
                .sortBy(dataElement => dataElement.name)
                .value();

            return Future.success(dataElements);
        });
    }

    private validateDisaggregation(
        selectedDisaggregations: SectionDisaggregation[],
        dataElement: DataElement
    ): Maybe<SectionDisaggregation> {
        if (!dataElement.disaggregation) return undefined;

        return selectedDisaggregations.find(d => {
            if (d.type === "combos") {
                return d.disaggregationId === dataElement.disaggregation?.id;
            } else {
                return d.id === dataElement.disaggregation?.id;
            }
        });
    }

    private getDataValues(analysis: QualityAnalysis) {
        return this.dataValueUseCase.get(
            analysis.countriesAnalysis,
            [analysis.module.id],
            [analysis.startDate, analysis.endDate]
        );
    }

    private getSectionSetting(settings: Settings): SectionSetting {
        const sectionSetting = settings.sections.find(section => section.id === disaggregateKey);
        if (!sectionSetting) throw Error(`Cannot found section in settings: ${disaggregateKey}`);
        return sectionSetting;
    }
}

type GetMissingDisaggregatesOptions = {
    analysisId: Id;
    disaggregationsIds: Id[];
};

type MissingValues = {
    type: "combos" | "dataElements";
    values: Array<MissingDisaggregates | MissingComboValue>;
};
