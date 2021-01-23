import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';

export abstract class ArrayParameter<T> extends Parameter<T> {
    constructor(initValue: T, possibleValues: T[], id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata("possibleValues", possibleValues);
    }
}
