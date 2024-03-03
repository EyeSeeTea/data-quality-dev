import React, { useContext } from "react";
import { CompositionRoot } from "../../CompositionRoot";
import { User } from "../../domain/entities/User";
import { MetadataItem } from "$/domain/entities/MetadataItem";
import { D2Api } from "$/types/d2-api";

export interface AppContextState {
    currentUser: User;
    compositionRoot: CompositionRoot;
    metadata: MetadataItem;
    api: D2Api;
}

export const AppContext = React.createContext<AppContextState | null>(null);

export function useAppContext() {
    const context = useContext(AppContext);
    if (context) {
        return context;
    } else {
        throw new Error("App context uninitialized");
    }
}
