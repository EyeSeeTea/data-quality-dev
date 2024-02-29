import { GetIssuesOptions } from "$/domain/repositories/IssueRepository";

export const initialFilters: GetIssuesOptions["filters"] = {
    endDate: undefined,
    name: undefined,
    startDate: undefined,
    status: undefined,
    ids: undefined,
    sectionId: "",
};
