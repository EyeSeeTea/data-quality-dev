import { render, RenderResult } from "@testing-library/react";
import { SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { ReactNode } from "react";
import { AppContext, AppContextState } from "../webapp/contexts/app-context";
import { getTestCompositionRoot } from "../CompositionRoot";
import { createAdminUser } from "../domain/entities/__tests__/userFixtures";
import { MetadataItem } from "$/domain/entities/MetadataItem";

export function getTestContext() {
    const context: AppContextState = {
        currentUser: createAdminUser(),
        compositionRoot: getTestCompositionRoot(),
        metadata: {} as MetadataItem,
    };

    return context;
}

export function getReactComponent(children: ReactNode): RenderResult {
    const context = getTestContext();

    return render(
        <AppContext.Provider value={context}>
            <SnackbarProvider>{children}</SnackbarProvider>
        </AppContext.Provider>
    );
}
