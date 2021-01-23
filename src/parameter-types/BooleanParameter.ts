import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';
import { Parameter } from '../base/Parameter';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class BooleanParameter extends Parameter<boolean> {
    constructor(initValue: boolean, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata("type", ParameterType.BOOLEAN);
    }

    get blueprint(): ParameterBlueprint {
        return { type: this.type, value: this.value };
    }
}