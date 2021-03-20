import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class ContinuousParameter extends Parameter<number> {

    constructor(initValue: number, min: number, max: number, step: number, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata("type", ParameterType.CONTINUOUS);
        this.setMetadata("step", step);
        this.setMetadata("max", max);
        this.setMetadata("min", min);
    }

    get blueprint(): ParameterBlueprint {
        return { type: this.type, max: this.getMetadata("max"), min: this.getMetadata("min"), step: this.getMetadata("step"), value: this.value };
    }

    update(newVal: number): number {
        let valToSend: number;
        if (newVal < this.getMetadata("min")) valToSend = this.getMetadata("min");
        else if (newVal > this.getMetadata("max")) valToSend = this.getMetadata("max");
        else valToSend = newVal;
        return super.update(valToSend);
    }
}