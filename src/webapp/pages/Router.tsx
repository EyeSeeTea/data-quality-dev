import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ExamplePage } from "./example/ExamplePage";
import { LandingPage } from "./landing/LandingPage";
import i18n from "$/utils/i18n";
import { DashboardPage } from "./dashboard/DashboardPage";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route
                    path="/for/:name?"
                    render={({ match }) => <ExamplePage name={match.params.name ?? "Stranger"} />}
                />

                {/* Default route */}
                <Route
                    path="/dashboard"
                    render={() => <DashboardPage name={i18n.t("Data Quality Analysis")} />}
                />
                <Route render={() => <LandingPage />} />
            </Switch>
        </HashRouter>
    );
}
