import { ArrayParameter } from "./ArrayParameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class StringArrayParameter extends ArrayParameter<string> {
    constructor(initValue: string, possibleValues: string[], id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, possibleValues, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata("type", ParameterType.STRING_ARRAY);
    }

    get blueprint(): ParameterBlueprint {
        return { type: this.type, values: this.getMetadata("values"), value: this.value };
    }
}