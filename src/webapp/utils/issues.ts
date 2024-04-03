import { GetIssuesOptions } from "$/domain/repositories/IssueRepository";

export const initialFilters: GetIssuesOptions["filters"] = {
    actions: [],
    countries: [],
    periods: [],
    name: undefined,
    status: [],
    analysisIds: undefined,
    sectionId: "",
    id: undefined,
    followUp: undefined,
    step: [],
};
