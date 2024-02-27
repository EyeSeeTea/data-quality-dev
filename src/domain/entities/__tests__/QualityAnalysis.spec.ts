import { describe, expect, it, vi } from "vitest";
import { QualityAnalysis, QualityAnalysisAttrs } from "../QualityAnalysis";

function createQualityAnalysis(data: Partial<QualityAnalysisAttrs>) {
    return QualityAnalysis.build({
        ...data,
        status: data.status || "pending",
        id: "1",
        endDate: "2021-01-01",
        module: { id: "1", name: "Module 1" },
        name: data.name || "",
        startDate: "2021-01-01",
        sections: [],
    });
}

describe("Quality Analysis", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should throw Error if required attributes are not present", () => {
        expect(() => createQualityAnalysis({}).get()).toThrow();
    });

    it("should generate a default name with the format: [#{value} - #{currentdate}]", () => {
        const date = new Date("2024-01-31T08:22:51.051Z");
        vi.setSystemTime(date);
        const fakeUserName = "john";
        const qualityAnalysisName = QualityAnalysis.buildDefaultName("", fakeUserName);
        expect(qualityAnalysisName).toBe(`${fakeUserName} - 2024_01_31_08_22_51_051Z`);
    });
});
