import { Parameter } from "./base/Parameter";

export interface ParameterValueChangeEvent<T> {
    parameter: Parameter<T>;
    value: T;
}

export interface ParameterMetadataChangeEvent<T> {
    parameter: Parameter<T>;
    metadataUpdated?: {
        key: string;
        value: any;
    };
    metadataRemoved?: {
        key: string;
    };
}