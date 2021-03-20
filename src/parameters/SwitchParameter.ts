import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';
import { Parameter } from '../base/Parameter';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

// ON -> true
// OFF -> false
export class SwitchParameter extends Parameter<boolean> {
    constructor(initValue: boolean, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata("type", ParameterType.SWITCH);
    }

    get blueprint(): ParameterBlueprint {
        return { type: this.type, value: this.value };
    }
}