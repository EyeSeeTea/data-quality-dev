import { FutureData } from "$/data/api-futures";
import { User } from "$/domain/entities/User";
import { IssueAction } from "$/domain/entities/IssueAction";
import { IssueStatus } from "$/domain/entities/IssueStatus";
import { MetadataItem } from "$/domain/entities/MetadataItem";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { IssuePropertyName, QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { Id } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";
import { UserRepository } from "$/domain/repositories/UserRepository";
import _ from "$/domain/entities/generic/Collection";
import { Maybe } from "$/utils/ts-utils";

export class SaveIssueUseCase {
    constructor(
        private analysisRepository: QualityAnalysisRepository,
        private userRepository: UserRepository,
        private metadata: MetadataItem
    ) {}

    execute(options: SaveIssueOptions): FutureData<SaveIssueResponse> {
        return this.getAnalysis(options).flatMap(analysis => {
            return this.generateContactEmails(analysis, options).flatMap(contactEmails => {
                const issueToUpdate = this.buildIssueWithNewValue(options, contactEmails);
                const analysisUpdate = QualityAnalysis.build({
                    ...analysis,
                    sections: analysis.sections.map(section => {
                        if (section.id !== options.issue.type) return section;
                        return QualityAnalysisSection.create({
                            ...section,
                            issues: [issueToUpdate],
                        });
                    }),
                }).get();

                return this.analysisRepository.save([analysisUpdate]).flatMap(() => {
                    return Future.success({ contactEmailsChanged: Boolean(contactEmails) });
                });
            });
        });
    }

    private generateContactEmails(
        analysis: QualityAnalysis,
        options: SaveIssueOptions
    ): FutureData<Maybe<ContactEmailsUsers>> {
        if (options.propertyToUpdate === "followUp" && options.valueToUpdate === true) {
            const usersIds = this.getUsersIdsFromGroup(analysis);
            if (usersIds.length === 0) return Future.success(undefined);

            return this.getUsersByIds(usersIds, options.issue).flatMap(users => {
                const contactEmails = this.getContactEmailsUsers(users);
                return Future.success(contactEmails);
            });
        }
        return Future.success(undefined);
    }

    private getContactEmailsUsers(users: User[]): Maybe<ContactEmailsUsers> {
        const firstUser = _(users).first();
        if (!firstUser) return undefined;
        const ccUsers = users.slice(1);
        return { to: firstUser, cc: ccUsers };
    }

    private getUsersByIds(userIds: Id[], issue: QualityAnalysisIssue): FutureData<User[]> {
        return this.userRepository.getByIds(userIds).flatMap(users => {
            const loggedInUsersWithEmail = this.getLoggedInUsersWithEmail(users);
            const usersInCountry = this.getUsersInIssueCountry(loggedInUsersWithEmail, issue);
            return Future.success(usersInCountry);
        });
    }

    private getUsersInIssueCountry(users: User[], issue: QualityAnalysisIssue): User[] {
        return _(users)
            .map(user => {
                const userIsInIssueCountry = user.countries.some(
                    country => country.writeAccess && country.id === issue.country?.id
                );
                return userIsInIssueCountry ? user : undefined;
            })
            .compact()
            .value();
    }

    private getLoggedInUsersWithEmail(users: User[]): User[] {
        return _(users)
            .map(user => {
                if (!user.email || !user.lastLogin) return undefined;
                return user;
            })
            .compact()
            .sortBy(user => user.lastLogin, {
                compareFn: (first, second) => {
                    if (!first || !second) return 0;
                    return first < second ? 1 : first > second ? -1 : 0;
                },
            })
            .value();
    }

    private getUsersIdsFromGroup(analysis: QualityAnalysis): Id[] {
        if (analysis.module.name.toLocaleLowerCase().includes("module 1")) {
            return this.metadata.userGroups.dataCaptureModule1.users.map(user => user.id);
        } else if (analysis.module.name.toLocaleLowerCase().includes("module 2")) {
            return this.metadata.userGroups.dataCaptureModule2And4.users.map(user => user.id);
        } else {
            return [];
        }
    }

    private buildIssueWithNewValue(
        options: SaveIssueOptions,
        contactEmails: Maybe<ContactEmailsUsers>
    ): QualityAnalysisIssue {
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
                const value = options.valueToUpdate as boolean;
                return QualityAnalysisIssue.create({
                    ...options.issue,
                    contactEmails: value
                        ? this.getContactEmailsString(contactEmails)
                        : options.issue.contactEmails,
                    followUp: value,
                });
            }
            default:
                return options.issue;
        }
    }

    private getContactEmailsString(contactEmails: Maybe<ContactEmailsUsers>): string {
        if (!contactEmails) return "";
        const to = `TO: ${contactEmails.to.email}`;
        const cc = contactEmails.cc.map(user => user.email).join(";");
        return cc ? `${to} || CC:${cc}` : to;
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

type ContactEmailsUsers = { to: User; cc: User[] };

type SaveIssueResponse = {
    contactEmailsChanged: boolean;
};
