import { D2Api } from "$/types/d2-api";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { GetIssuesOptions, IssueRepository } from "$/domain/repositories/IssueRepository";
import { FutureData, apiToFuture } from "../api-futures";
import { RowsPaginated } from "$/domain/entities/Pagination";
import { Future } from "$/domain/entities/generic/Future";
import { logger } from "$/utils/logger";
import { MetadataItem } from "$/domain/entities/MetadataItem";
import _ from "$/domain/entities/generic/Collection";
import { Id } from "$/domain/entities/Ref";

export class IssueD2Repository implements IssueRepository {
    constructor(private api: D2Api, private metadata: MetadataItem) {}

    get(options: GetIssuesOptions): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        return apiToFuture(
            this.api.tracker.events.get({
                programStage: options.programStage ? options.programStage : undefined,
                fields: { $owner: true },
                totalPages: true,
                trackedEntity: options.ids ? options.ids.join(";") : undefined,
            })
        ).map(d2Response => {
            return {
                pagination: {
                    pageSize: d2Response.pageSize,
                    // @ts-ignore
                    pageCount: d2Response.pageCount,
                    page: d2Response.page,
                    total: d2Response.total || 0,
                },
                rows: [],
            };
        });
    }

    save(issues: QualityAnalysisIssue[], analysisId: Id): FutureData<void> {
        const programStageId = _(issues).first()?.type;
        if (!programStageId)
            return Future.error(new Error(`Cannot found programStage: ${programStageId}`));

        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                ouMode: "ALL",
                fields: { trackedEntity: true, enrollments: true },
                program: this.metadata.programs.qualityIssues.id,
                trackedEntity: analysisId,
            })
        ).flatMap(d2Response => {
            const tei = d2Response.instances.find(tei => tei.trackedEntity === analysisId);
            if (!tei) return Future.error(new Error(`Cannot found TEI: ${tei}`));
            const enrollment = _(tei.enrollments || []).first();
            if (!enrollment)
                return Future.error(new Error(`Cannot found Enrollment in TEI: ${tei}`));

            const $requests = issues.map(issue => {
                return Future.fromPromise(
                    logger.info({
                        config: {
                            trackedEntityId: analysisId,
                            programStageId: programStageId,
                            enrollmentId: enrollment.enrollment,
                        },
                        messages: [
                            {
                                id: this.metadata.dataElements.status.id,
                                value: issue.status?.code || "",
                            },
                            { id: this.metadata.dataElements.issueNumber.id, value: issue.number },
                            {
                                id: this.metadata.dataElements.country.id,
                                value: issue.country?.id || "",
                            },
                            {
                                id: this.metadata.dataElements.description.id,
                                value: issue.description,
                            },
                            {
                                id: this.metadata.dataElements.action.id,
                                value: issue.action?.code || "",
                            },
                            {
                                id: this.metadata.dataElements.dataElement.id,
                                value: issue.dataElement?.id || "",
                            },
                            {
                                id: this.metadata.dataElements.azureUrl.id,
                                value: issue.azureUrl,
                            },
                            {
                                id: this.metadata.dataElements.actionDescription.id,
                                value: issue.actionDescription,
                            },
                            { id: this.metadata.dataElements.period.id, value: issue.period },
                            {
                                id: this.metadata.dataElements.categoryOption.id,
                                value: issue.categoryOption?.id || "",
                            },
                            {
                                id: this.metadata.dataElements.followUp.id,
                                value: issue.followUp ? "true" : "",
                            },
                        ],
                    })
                );
            });

            return Future.sequential($requests).flatMap(() => {
                return Future.success(undefined);
            });
        });
    }
}
