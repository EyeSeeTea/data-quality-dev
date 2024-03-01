import { render } from "@testing-library/react";

import App from "../App";
import { getTestContext } from "../../../../utils/tests";
import { Provider } from "@dhis2/app-runtime";
import { MetadataItem } from "$/domain/entities/MetadataItem";

describe("App", () => {
    it("renders the feedback component", async () => {
        const view = getView();

        expect(await view.findByText("Data Quality Analysis")).toBeInTheDocument();
    });
});

function getView() {
    const { compositionRoot } = getTestContext();
    return render(
        <Provider config={{ baseUrl: "http://localhost:8080", apiVersion: 30 }}>
            <App compositionRoot={compositionRoot} metadata={{} as MetadataItem} />
        </Provider>
    );
}
