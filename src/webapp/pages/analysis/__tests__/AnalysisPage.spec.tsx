import { getReactComponent } from "$/utils/tests";
import { AnalysisPage } from "$/webapp/pages/analysis/AnalysisPage";

describe("AnalysisPage", () => {
    it("renders the feedback component", async () => {
        const view = getView();

        expect(await view.findByText("Analysis")).toBeInTheDocument();
        expect(view.asFragment()).toMatchSnapshot();
    });
});

function getView() {
    return getReactComponent(<AnalysisPage name="Analysis" />);
}
