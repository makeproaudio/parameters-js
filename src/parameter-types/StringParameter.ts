import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class StringParameter extends Parameter<string> {
    constructor(initValue: string, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata("type", ParameterType.STRING);
    }

    get blueprint(): ParameterBlueprint {
        return { type: this.type, value: this.value };
    }
}