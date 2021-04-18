import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../models/Events';
import { Parameter } from '../base/Parameter';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';
import { KnownParameterMetadata } from "../models/KnownParameterMetadata";

export class BooleanParameter extends Parameter<boolean> {
    constructor(initValue: boolean, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata(KnownParameterMetadata.TYPE, ParameterType.BOOLEAN);
    }

    get blueprint(): ParameterBlueprint {
        return { [KnownParameterMetadata.TYPE]: this.type, value: this.value };
    }
}