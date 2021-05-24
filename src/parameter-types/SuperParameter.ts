import { SuperParameterTypeChangeRequestToken, BindFromRequestToken } from "../models/RequestTokens";
import { ParameterType } from "../models/ParameterType";
import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../models/Events';
import { ParameterBlueprint } from "../models/ParameterBlueprint";
import { KnownParameterMetadata } from "../models/KnownParameterMetadata";

/* The Super Parameter works on a few pre-defined conventions*/
export class SuperParameter extends Parameter<any> {

    get min(): number | undefined {
        return this.getMetadata(KnownParameterMetadata.MIN);
    }

    get max(): number | undefined {
        return this.getMetadata(KnownParameterMetadata.MAX);
    }

    get step(): number | undefined {
        return this.getMetadata(KnownParameterMetadata.STEP);
    }

    get possibleValues(): any[] | undefined {
        return this.getMetadata(KnownParameterMetadata.VALUES);
    }

    get blueprint(): ParameterBlueprint {
        switch (this.type) {
            case ParameterType.BOOLEAN:
                return { [KnownParameterMetadata.TYPE]: this.type, value: this.value };
            case ParameterType.NUMBER:
                return { [KnownParameterMetadata.TYPE]: this.type, [KnownParameterMetadata.MAX]: this.max, [KnownParameterMetadata.MIN]: this.min, [KnownParameterMetadata.STEP]: this.step, value: this.value };
            case ParameterType.NUMBER_ARRAY:
                return { [KnownParameterMetadata.TYPE]: this.type, [KnownParameterMetadata.VALUES]: this.possibleValues, value: this.value };
            case ParameterType.STRING:
                return { [KnownParameterMetadata.TYPE]: this.type, value: this.value };
            case ParameterType.STRING_ARRAY:
                return { [KnownParameterMetadata.TYPE]: this.type, [KnownParameterMetadata.VALUES]: this.possibleValues, value: this.value };
            // highlevel parameters
            case ParameterType.SELECTOR:
                return { [KnownParameterMetadata.TYPE]: this.type, [KnownParameterMetadata.VALUES]: this.possibleValues, value: this.value };
            case ParameterType.CONTINUOUS:
                return { [KnownParameterMetadata.TYPE]: this.type, [KnownParameterMetadata.MAX]: this.max, [KnownParameterMetadata.MIN]: this.min, [KnownParameterMetadata.STEP]: this.step, value: this.value };
            case ParameterType.SWITCH:
                return { [KnownParameterMetadata.TYPE]: this.type, value: this.value };
            default:
                return { [KnownParameterMetadata.TYPE]: this.type, value: this.value };
        }
    }

    /* By default, a freshly constructed SuperParameter will be of type switch. This is done to 
    * channel the type updation of a SuperParameter through the TypeChangeRequest only and to keep
    the process of creation simplistic */
    constructor(id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(false, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata(KnownParameterMetadata.TYPE, ParameterType.SWITCH);
    }

    private areAllOfSameType(arr: any[], type: string) {
        let typesValid = true;
        arr.forEach(v => {
            if (typeof v !== type) typesValid = false;
        });
        return typesValid;
    }

    /* There are several constraints to be supplied when attempting to update the type of a SuperParameter
     * This is captured here in this method*/
    private validateParameterTypeChangeRequest(req: ParameterBlueprint): boolean {
        switch (req.TYPE) {
            case ParameterType.BOOLEAN:
                if (req.MAX === undefined && req.MIN === undefined && req.STEP === undefined && req.VALUES === undefined) {
                    if (typeof req.value === 'boolean') {
                        return true;
                    }
                }
                return false;
            case ParameterType.NUMBER:
                if (req.MAX !== undefined && req.MIN !== undefined && req.STEP !== undefined && req.VALUES === undefined) {
                    if (typeof req.value === 'number') {
                        return true;
                    }
                }
                return false;
            case ParameterType.NUMBER_ARRAY:
                if (req.MAX === undefined && req.MIN === undefined && req.STEP === undefined && req.VALUES !== undefined) {
                    if (req.VALUES.length > 0) {
                        if (this.areAllOfSameType(req.VALUES, 'number')) {
                            return true;
                        }
                    }
                }
                return false;
            case ParameterType.STRING:
                if (req.MAX === undefined && req.MIN === undefined && req.STEP === undefined && req.VALUES === undefined) {
                    if (typeof req.value === 'string') {
                        return true;
                    }
                }
                return false;
            case ParameterType.STRING_ARRAY:
                if (req.MAX === undefined && req.MIN === undefined && req.STEP === undefined && req.VALUES !== undefined) {
                    if (req.VALUES.length > 0) {
                        if (this.areAllOfSameType(req.VALUES, 'string')) {
                            return true;
                        }
                    }
                }
                return false;
            // highlevel parameters
            case ParameterType.CONTINUOUS:
                if (req.MAX !== undefined && req.MIN !== undefined && req.STEP !== undefined && req.VALUES === undefined) {
                    if (typeof req.value === 'number') {
                        return true;
                    }
                }
                return false;
            case ParameterType.SELECTOR:
                if (req.MAX === undefined && req.MIN === undefined && req.STEP === undefined && req.VALUES !== undefined) {
                    if (req.VALUES.length > 0) {
                        return true;
                    }
                }
                return false;
            case ParameterType.SWITCH:
                if (req.MAX === undefined && req.MIN === undefined && req.STEP === undefined && req.VALUES === undefined) {
                    if (typeof req.value === 'boolean') {
                        return true;
                    }
                }
                return false;
            default:
                return false;
        }
    }

    /* For a SuperParameter, updating the type enjoys the rights of a first-class citizen.
     * A standard usage would encompass creating a SuperParameter and then immediately updating its type */
    updateType(req: ParameterBlueprint, secretly?: boolean) {
        if (!this.validateParameterTypeChangeRequest(req)) throw new Error('cannot update type due to validation failure');
        this.setMetadata(KnownParameterMetadata.TYPE, req.TYPE);
        if (req.TYPE === ParameterType.NUMBER) this.setMinMaxStep(req.MIN!, req.MAX!, req.STEP!, req.value, secretly);
        if (req.TYPE === ParameterType.NUMBER_ARRAY || req.TYPE === ParameterType.STRING_ARRAY) this.setValues(req.VALUES!, req.value, secretly);
        if (req.TYPE === ParameterType.STRING || req.TYPE === ParameterType.BOOLEAN) this.setValueSpecific(req.value, secretly);
        // highlevel parameters
        if (req.TYPE === ParameterType.CONTINUOUS) this.setMinMaxStep(req.MIN!, req.MAX!, req.STEP!, req.value, secretly);
        if (req.TYPE === ParameterType.SELECTOR) this.setValues(req.VALUES!, req.value, secretly);
        if (req.TYPE === ParameterType.SWITCH) this.setValueSpecific(req.value, secretly);

    }

    private setMinMaxStep(min: number, max: number, step: number, value: number, listenerUpdate: undefined | boolean = undefined): any {
        this.setMetadataSeveral({
            [SuperParameterTypeChangeRequestToken]: true,
            [KnownParameterMetadata.TYPE]: this.type,
            [KnownParameterMetadata.MIN]: min,
            [KnownParameterMetadata.MAX]: max,
            [KnownParameterMetadata.STEP]: step
        }, listenerUpdate);
        return this.update(value);
    }

    private setValues(values: any[], value: any, listenerUpdate: undefined | boolean = undefined): any {
        this.setMetadataSeveral({
            [SuperParameterTypeChangeRequestToken]: true,
            [KnownParameterMetadata.TYPE]: this.type,
            [KnownParameterMetadata.MIN]: undefined,
            [KnownParameterMetadata.MAX]: undefined,
            [KnownParameterMetadata.STEP]: undefined,
            [KnownParameterMetadata.VALUES]: values,
        }, listenerUpdate);
        return this.update(value);
    }

    private setValueSpecific(value: string | boolean, listenerUpdate: undefined | boolean = undefined): any {
        this.setMetadataSeveral({
            [SuperParameterTypeChangeRequestToken]: true,
            [KnownParameterMetadata.TYPE]: this.type,
            [KnownParameterMetadata.MIN]: undefined,
            [KnownParameterMetadata.MAX]: undefined,
            [KnownParameterMetadata.STEP]: undefined,
            [KnownParameterMetadata.VALUES]: undefined,
        }, listenerUpdate);
        return this.update(value);
    }

    /* The SuperParameter ecosystem provides more convenient ways to update the value of a Parameter.
     * Depending on the current type of the Parameter, updateCyclic could do one of several things */
    updateCyclic(listenerUpdate: undefined | boolean = undefined): any {
        if (this.type === ParameterType.STRING) this.update(this.value, listenerUpdate);
        if ((this.type === ParameterType.NUMBER_ARRAY || this.type === ParameterType.STRING_ARRAY || this.type == ParameterType.SELECTOR) && this.possibleValues) {
            const currIndex = this.possibleValues!.indexOf(this.value);
            const indexToSet = (currIndex + 1) % this.possibleValues!.length;
            return this.update(this.possibleValues![indexToSet], listenerUpdate);
        }
        if (this.type === ParameterType.BOOLEAN || this.type == ParameterType.SWITCH) this.update(!this.value, listenerUpdate);
        if (this.type === ParameterType.NUMBER || this.type == ParameterType.CONTINUOUS) {
            const nextValue = (this.value as number) + this.step!;
            if (nextValue > this.max!) {
                this.update(this.min!, listenerUpdate);
            } else {
                this.update(nextValue, listenerUpdate);
            }
        }
    }

    updateNext(jumps: number, listenerUpdate: undefined | boolean = undefined): any {
        if (this.type === ParameterType.STRING) this.update(this.value, listenerUpdate);
        if ((this.type === ParameterType.NUMBER_ARRAY || this.type === ParameterType.STRING_ARRAY || this.type == ParameterType.SELECTOR) && this.possibleValues!) {
            const currIndex = this.possibleValues!.indexOf(this.value);
            const indexToSet = Math.min(currIndex + 1, this.possibleValues!.length - 1);
            return this.update(this.possibleValues![indexToSet], listenerUpdate);
        }
        if (this.type === ParameterType.BOOLEAN) this.update(!this.value, listenerUpdate);
        if (this.type == ParameterType.SWITCH) this.update(true, listenerUpdate);
        if (this.type === ParameterType.NUMBER || this.type == ParameterType.CONTINUOUS) this.update(Math.round((this.value as number) + this.step! * jumps));
    }

    updatePrevious(jumps: number, listenerUpdate: undefined | boolean = undefined): any {
        if (this.type === ParameterType.STRING) this.update(this.value, listenerUpdate);
        if ((this.type === ParameterType.NUMBER_ARRAY || this.type === ParameterType.STRING_ARRAY || this.type == ParameterType.SELECTOR) && this.possibleValues!) {
            const currIndex = this.possibleValues!.indexOf(this.value);
            const indexToSet = Math.max(currIndex - 1, 0);
            return this.update(this.possibleValues![indexToSet], listenerUpdate);
        }
        if (this.type === ParameterType.BOOLEAN) this.update(!this.value, listenerUpdate);
        if (this.type == ParameterType.SWITCH) this.update(false, listenerUpdate);
        if (this.type === ParameterType.NUMBER || this.type == ParameterType.CONTINUOUS) this.update(Math.round((this.value as number) - this.step! * jumps), listenerUpdate);
    }

    /* This overrides the standard update method of the Parameter by adding a few checks before making the update */
    update(newVal: string | boolean | number, listenerUpdate: undefined | boolean = undefined): any {
        if (this.type === ParameterType.NUMBER || this.type == ParameterType.CONTINUOUS) {
            let valToSend: number;
            if (newVal < this.min!) valToSend = this.min!;
            else if (newVal > this.max!) valToSend = this.max!;
            else valToSend = newVal as number;
            return super.update(valToSend, listenerUpdate);
        } else if ((this.type === ParameterType.NUMBER_ARRAY || this.type === ParameterType.STRING_ARRAY || this.type === ParameterType.SELECTOR) && this.possibleValues!) {
            if (this.possibleValues!.indexOf(newVal) < 0) {
                //bad update - return existing value
                return super.value;
            }
        }
        super.update(newVal, listenerUpdate);
    }

    /* incoming range must be between 0 and 1 */
    updateRanged(newVal: number): any {
        if (this.type !== ParameterType.NUMBER && this.type !== ParameterType.CONTINUOUS) return super.value;
        const valToSend: number = this.min! + ((this.max! - this.min!) * (newVal - 0)) / (1 - 0);
        let rounded = 0;
        if (valToSend > 0) rounded = Math.ceil(valToSend / this.step!) * this.step!;
        else if (valToSend < 0) rounded = Math.floor(valToSend / this.step!) * this.step!;
        super.update(rounded);
    }

    bindFrom(other: Parameter<any>, valueCallback?: (parameterChangeEvent: ParameterValueChangeEvent<any>) => void, metadataCallback?: (parameterChangeEvent: ParameterMetadataChangeEvent<any>) => void) {
        const currBlueprint = this.blueprint;
        this.updateType(other.blueprint, true);
        try {
            super.bindFrom(other, valueCallback, metadataCallback);
            this.setMetadataSeveral(Object.assign((Object as any).fromEntries(other.getAllMetadata()), { [BindFromRequestToken]: true }), true);
        } catch (err) {
            this.updateType(currBlueprint, true);
        }
    }
}