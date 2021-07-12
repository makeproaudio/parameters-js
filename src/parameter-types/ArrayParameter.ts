import { KnownParameterMetadata } from "../models/KnownParameterMetadata";
import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../models/Events';

export abstract class ArrayParameter<T> extends Parameter<T> {
    constructor(initValue: T, possibleValues: T[], id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, forceOwnValue?: boolean, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void, forceOwnMetadata?: boolean) {
        super(initValue, id, valueChangeCallback, forceOwnValue, metadataChangeCallback, forceOwnMetadata);
        this.setMetadata(KnownParameterMetadata.VALUES, possibleValues);
    }
}
