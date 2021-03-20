import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class SelectorParameter<T> extends Parameter<T> {
    constructor(initValue: T, values: T[], id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata("type", ParameterType.SELECTOR);
        this.setMetadata("values", values);
    }

    get blueprint(): ParameterBlueprint {
        return { type: this.type, values: this.getMetadata("values"), value: this.value };
    }

    public update(newVal: T): T {
        if (!this.getMetadata("values").includes(newVal)) {
            return newVal;
        }
        return super.update(newVal);
    }
}