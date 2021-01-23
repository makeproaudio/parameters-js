import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class NumberParameter extends Parameter<number> {
    private min: number;
    private max: number;
    private step: number;

    constructor(initValue: number, min: number, max: number, step: number, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.min = min;
        this.max = max;
        this.step = step;
        this.setMetadata("type", ParameterType.NUMBER);
    }

    get blueprint(): ParameterBlueprint {
        return { type: this.type, max: this.max, min: this.min, step: this.step, value: this.value };
    }

    update(newVal: number): number {
        let valToSend: number;
        if (newVal < this.min) valToSend = this.min;
        else if (newVal > this.max) valToSend = this.max;
        else valToSend = newVal;
        return super.update(valToSend);
    }
}