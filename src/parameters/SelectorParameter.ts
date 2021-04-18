import { KnownParameterMetadata } from "../models/KnownParameterMetadata";
import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../models/Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class SelectorParameter<T> extends Parameter<T> {
    constructor(initValue: T, values: T[], id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata(KnownParameterMetadata.TYPE, ParameterType.SELECTOR);
        this.setMetadata(KnownParameterMetadata.VALUES, values);
    }

    get blueprint(): ParameterBlueprint {
        return { [KnownParameterMetadata.TYPE]: this.type, [KnownParameterMetadata.VALUES]: this.getMetadata(KnownParameterMetadata.VALUES), value: this.value };
    }

    public update(newVal: T): T {
        if (!this.getMetadata(KnownParameterMetadata.VALUES).includes(newVal)) {
            return newVal;
        }
        return super.update(newVal);
    }
}