import { KnownParameterMetadata } from "../models/KnownParameterMetadata";
import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../models/Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class StringParameter extends Parameter<string> {
    constructor(initValue: string, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, forceOwnValue?: boolean, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void, forceOwnMetadata?: boolean) {
        super(initValue, id, valueChangeCallback, forceOwnValue, metadataChangeCallback, forceOwnMetadata);
        this.setMetadata(KnownParameterMetadata.TYPE, ParameterType.STRING);
    }

    get blueprint(): ParameterBlueprint {
        return {
            [KnownParameterMetadata.TYPE]: this.type,
            value: this.value
        };
    }
}