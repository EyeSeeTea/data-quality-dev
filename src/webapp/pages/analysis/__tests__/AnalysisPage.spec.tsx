import { getReactComponent } from "../../../../utils/tests";
import { AnalysisPage } from "../../analysis/AnalysisPage";

describe("ExamplePage", () => {
    it("renders the feedback component", async () => {
        const view = getView();

        expect(await view.findByText("Analysis page")).toBeInTheDocument();
        expect(view.asFragment()).toMatchSnapshot();
    });
});

function getView() {
    return getReactComponent(<AnalysisPage name="Analysis" />);
}
