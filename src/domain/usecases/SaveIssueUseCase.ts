import { FutureData } from "$/data/api-futures";
import { IssueAction } from "../entities/IssueAction";
import { IssueStatus } from "../entities/IssueStatus";
import { MetadataItem } from "../entities/MetadataItem";
import { QualityAnalysis } from "../entities/QualityAnalysis";
import { IssuePropertyName, QualityAnalysisIssue } from "../entities/QualityAnalysisIssue";
import { QualityAnalysisSection } from "../entities/QualityAnalysisSection";
import { Id } from "../entities/Ref";
import { QualityAnalysisRepository } from "../repositories/QualityAnalysisRepository";

export class SaveIssueUseCase {
    constructor(
        private analysisRepository: QualityAnalysisRepository,
        private metadata: MetadataItem
    ) {}

    execute(options: SaveIssueOptions): FutureData<void> {
        return this.getAnalysis(options).flatMap(analysis => {
            const analysisUpdate = QualityAnalysis.build({
                ...analysis,
                sections: analysis.sections.map(section => {
                    return QualityAnalysisSection.create({
                        ...section,
                        issues: section.issues.map(issue => {
                            if (issue.id !== options.issue.id) return issue;
                            return this.buildIssueWithNewValue(options);
                        }),
                    });
                }),
            }).get();
            return this.analysisRepository.save([analysisUpdate]);
        });
    }

    private buildIssueWithNewValue(options: SaveIssueOptions): QualityAnalysisIssue {
        switch (options.propertyToUpdate) {
            case "azureUrl": {
                return this.setNewValue(options);
            }
            case "actionDescription": {
                return QualityAnalysisIssue.create({
                    ...options.issue,
                    actionDescription: options.valueToUpdate as string,
                });
            }
            case "contactEmails": {
                return QualityAnalysisIssue.create({
                    ...options.issue,
                    contactEmails: options.valueToUpdate as string,
                });
            }
            case "comments": {
                return QualityAnalysisIssue.create({
                    ...options.issue,
                    comments: options.valueToUpdate as string,
                });
            }
            case "description": {
                return QualityAnalysisIssue.create({
                    ...options.issue,
                    description: options.valueToUpdate as string,
                });
            }
            case "status": {
                const actionSelected = this.metadata.optionSets.nhwaStatus.options.find(
                    option => option.code === options.valueToUpdate
                );
                if (!actionSelected) return options.issue;

                return QualityAnalysisIssue.create({
                    ...options.issue,
                    status: IssueStatus.create(actionSelected),
                });
            }
            case "action": {
                const actionSelected = this.metadata.optionSets.nhwaAction.options.find(
                    option => option.code === options.valueToUpdate
                );
                if (!actionSelected) return options.issue;

                return QualityAnalysisIssue.create({
                    ...options.issue,
                    action: IssueAction.create(actionSelected),
                });
            }
            case "followUp": {
                return QualityAnalysisIssue.create({
                    ...options.issue,
                    followUp: options.valueToUpdate as boolean,
                });
            }
            default:
                return options.issue;
        }
    }

    private setNewValue(options: SaveIssueOptions): QualityAnalysisIssue {
        return QualityAnalysisIssue.create({
            ...options.issue,
            [options.propertyToUpdate]: options.valueToUpdate,
        });
    }

    private getAnalysis(options: SaveIssueOptions): FutureData<QualityAnalysis> {
        return this.analysisRepository.getById(options.analysisId);
    }
}

type SaveIssueOptions = {
    analysisId: Id;
    issue: QualityAnalysisIssue;
    propertyToUpdate: IssuePropertyName;
    valueToUpdate: string | boolean;
};
