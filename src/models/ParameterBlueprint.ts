import { KnownParameterMetadata } from "./KnownParameterMetadata";
import { ParameterType } from "./ParameterType";

export interface ParameterBlueprint {
    value: any;
    [KnownParameterMetadata.TYPE]: ParameterType;
    [KnownParameterMetadata.MIN]?: number;
    [KnownParameterMetadata.MAX]?: number;
    [KnownParameterMetadata.STEP]?: number;
    [KnownParameterMetadata.VALUES]?: any[];
}