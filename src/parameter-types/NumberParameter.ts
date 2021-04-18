import { KnownParameterMetadata } from "../models/KnownParameterMetadata";
import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../models/Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';

export class NumberParameter extends Parameter<number> {

    constructor(initValue: number, min: number, max: number, step: number, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(initValue, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata(KnownParameterMetadata.TYPE, ParameterType.NUMBER);
        this.setMetadata(KnownParameterMetadata.STEP, step);
        this.setMetadata(KnownParameterMetadata.MAX, max);
        this.setMetadata(KnownParameterMetadata.MIN, min);
    }

    get blueprint(): ParameterBlueprint {
        return {
            [KnownParameterMetadata.TYPE]: this.type,
            [KnownParameterMetadata.MAX]: this.getMetadata(KnownParameterMetadata.MAX),
            [KnownParameterMetadata.MIN]: this.getMetadata(KnownParameterMetadata.MIN),
            [KnownParameterMetadata.STEP]: this.getMetadata(KnownParameterMetadata.STEP),
            value: this.value
        };
    }

    update(newVal: number): number {
        let valToSend: number;
        if (newVal < this.getMetadata(KnownParameterMetadata.MIN)) valToSend = this.getMetadata(KnownParameterMetadata.MIN);
        else if (newVal > this.getMetadata(KnownParameterMetadata.MAX)) valToSend = this.getMetadata(KnownParameterMetadata.MAX);
        else valToSend = newVal;
        return super.update(valToSend);
    }
}