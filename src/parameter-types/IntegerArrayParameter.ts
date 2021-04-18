import { ArrayParameter } from "./ArrayParameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../models/Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';
import { KnownParameterMetadata } from "../models/KnownParameterMetadata";

export class IntegerArrayParameter extends ArrayParameter<number> {
    constructor(initValue: number, possibleValues: number[], id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, possibleValues, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata(KnownParameterMetadata.TYPE, ParameterType.NUMBER_ARRAY);
    }

    get blueprint(): ParameterBlueprint {
        return { [KnownParameterMetadata.TYPE]: this.type, [KnownParameterMetadata.VALUES]: this.getMetadata(KnownParameterMetadata.VALUES), value: this.value };
    }
}