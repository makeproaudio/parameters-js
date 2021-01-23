import { ParameterType } from "./ParameterType";

export interface ParameterBlueprint {
    type: ParameterType;
    min?: number;
    max?: number;
    step?: number;
    value: any;
    values?: any[];
}