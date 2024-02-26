import { FutureData } from "../../data/api-futures";
import { QualityAnalysis } from "../entities/QualityAnalysis";
import { IssueRepository } from "../repositories/IssueRepository";

export class CreateIssuesUseCase {
    constructor(private issueRepository: IssueRepository) {}

    execute(qualityAnalysis: QualityAnalysis): FutureData<void> {
        const issues = qualityAnalysis.sections.flatMap(section => section.issues);

        return this.issueRepository.save(issues);
    }
}
