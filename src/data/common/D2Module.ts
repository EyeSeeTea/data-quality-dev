import { MetadataItem } from "$/domain/entities/MetadataItem";
import { Module } from "$/domain/entities/Module";

export function getDefaultModules(metadata: MetadataItem): Module[] {
    return [
        {
            ...metadata.dataSets.module1,
            dataElements: [],
        },
        {
            ...metadata.dataSets.module2,
            dataElements: [],
        },
    ];
}
