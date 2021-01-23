import { ArrayParameter } from "./ArrayParameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class IntegerArrayParameter extends ArrayParameter<number> {
    constructor(initValue: number, possibleValues: number[], id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, possibleValues, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata("type", ParameterType.NUMBER_ARRAY);
    }

    get blueprint(): ParameterBlueprint {
        return { type: this.type, values: this.possibleValues, value: this.value };
    }
}