import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../models/Events';
import { Parameter } from '../base/Parameter';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';
import { KnownParameterMetadata } from '../models/KnownParameterMetadata';

// ON -> true
// OFF -> false
export class SwitchParameter extends Parameter<boolean> {
    constructor(initValue: boolean, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, forceOwnValue?: boolean, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void, forceOwnMetadata?: boolean) {
        super(initValue, id, valueChangeCallback, forceOwnValue, metadataChangeCallback, forceOwnMetadata);
        this.setMetadata(KnownParameterMetadata.TYPE, ParameterType.SWITCH);
    }

    get blueprint(): ParameterBlueprint {
        return { [KnownParameterMetadata.TYPE]: this.type, value: this.value };
    }
}