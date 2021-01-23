import { SuperParameterTypeChangeRequestToken, BindFromRequestToken } from "../models/RequestTokens";
import { ParameterType } from "../models/ParameterType";
import { Parameter } from "../base/Parameter";
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';
import { ParameterBlueprint } from "../models/ParameterBlueprint";

/* The Super Parameter works on a few pre-defined conventions*/
export class SuperParameter extends Parameter<any> {
    private classifiedMetadata = ['type', 'min', 'max', 'step', 'values'];

    get min(): number | undefined {
        return this.getMetadata('min');
    }

    get max(): number | undefined {
        return this.getMetadata('max');
    }

    get step(): number | undefined {
        return this.getMetadata('step');
    }

    get possibleValues(): any[] | undefined {
        return this.getMetadata('values');
    }

    get blueprint(): ParameterBlueprint {
        switch (this.type) {
            case ParameterType.BOOLEAN:
                return { type: this.type, value: this.value };
            case ParameterType.NUMBER:
                return { type: this.type, max: this.max, min: this.min, step: this.step, value: this.value };
            case ParameterType.NUMBER_ARRAY:
                return { type: this.type, values: this.possibleValues, value: this.value };
            case ParameterType.STRING:
                return { type: this.type, value: this.value };
            case ParameterType.STRING_ARRAY:
                return { type: this.type, values: this.possibleValues, value: this.value };
            default:
                return { type: this.type, value: this.value };
        }
    }

    /* By default, a freshly constructed SuperParameter will be of type boolean. This is done to 
    * channel the type updation of a SuperParameter through the TypeChangeRequest only and to keep
    the process of creation simplistic ƒ*/
    constructor(id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void) {
        super(false, id, valueChangeCallback, metadataChangeCallback);
        this.setMetadata('type', ParameterType.BOOLEAN);
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
        switch (req.type) {
            case ParameterType.BOOLEAN:
                if (req.max === undefined && req.min === undefined && req.step === undefined && req.values === undefined) {
                    if (typeof req.value === 'boolean') {
                        return true;
                    }
                }
                return false;
            case ParameterType.NUMBER:
                if (req.max !== undefined && req.min !== undefined && req.step !== undefined && req.values === undefined) {
                    if (typeof req.value === 'number') {
                        return true;
                    }
                }
                return false;
            case ParameterType.NUMBER_ARRAY:
                if (req.max === undefined && req.min === undefined && req.step === undefined && req.values !== undefined) {
                    if (req.values.length > 0) {
                        if (this.areAllOfSameType(req.values, 'number')) {
                            return true;
                        }
                    }
                }
                return false;
            case ParameterType.STRING:
                if (req.max === undefined && req.min === undefined && req.step === undefined && req.values === undefined) {
                    if (typeof req.value === 'string') {
                        return true;
                    }
                }
                return false;
            case ParameterType.STRING_ARRAY:
                if (req.max === undefined && req.min === undefined && req.step === undefined && req.values !== undefined) {
                    if (req.values.length > 0) {
                        if (this.areAllOfSameType(req.values, 'string')) {
                            return true;
                        }
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
        if (req.type === ParameterType.NUMBER) this.setMinMaxStep(req.min!, req.max!, req.step!, req.value, secretly);
        if (req.type === ParameterType.NUMBER_ARRAY || req.type === ParameterType.STRING_ARRAY) this.setValues(req.values!, req.value, secretly);
        if (req.type === ParameterType.STRING || req.type === ParameterType.BOOLEAN) this.setValueSpecific(req.value, secretly);
    }

    private setMinMaxStep(min: number, max: number, step: number, value: number, secretly?: boolean): any {
        this.setMetadata('type', ParameterType.NUMBER);
        this.setMetadataSeveral(SuperParameterTypeChangeRequestToken, this.classifiedMetadata, [this.type, min, max, step, undefined], secretly);
        return this.update(value);
    }

    private setValues(values: any[], value: any, secretly?: boolean): any {
        if (typeof values[0] === 'number') this.setMetadata('type', ParameterType.NUMBER_ARRAY);
        else if (typeof values[0] === 'string') this.setMetadata('type', ParameterType.STRING_ARRAY);
        this.setMetadataSeveral(SuperParameterTypeChangeRequestToken, this.classifiedMetadata, [this.type, undefined, undefined, undefined, values], secretly);
        return this.update(value);
    }

    private setValueSpecific(value: string | boolean, secretly?: boolean): any {
        if (typeof value === 'string') this.setMetadata('type', ParameterType.STRING);
        else if (typeof value === 'boolean') this.setMetadata('type', ParameterType.BOOLEAN);
        this.setMetadataSeveral(
            SuperParameterTypeChangeRequestToken,
            this.classifiedMetadata,
            [this.type, undefined, undefined, undefined, undefined],
            secretly
        );
        return this.update(value);
    }

    /* The SuperParameter ecosystem provides more convenient ways to update the value of a Parameter.
     * Depending on the current type of the Parameter, updateCyclic could do one of several things */
    updateCyclic(): any {
        if (this.type === ParameterType.STRING) this.update(this.value, true);
        if ((this.type === ParameterType.NUMBER_ARRAY || this.type === ParameterType.STRING_ARRAY) && this.possibleValues) {
            const currIndex = this.possibleValues!.indexOf(this.value);
            const indexToSet = (currIndex + 1) % this.possibleValues!.length;
            return this.update(this.possibleValues![indexToSet], true);
        }
        if (this.type === ParameterType.BOOLEAN) this.update(!this.value);
        if (this.type === ParameterType.NUMBER) {
            const nextValue = (this.value as number) + this.step!;
            if (nextValue > this.max!) {
                this.update(this.min!);
            } else {
                this.update(nextValue);
            }
        }
    }

    updateNext(jumps: number): any {
        if (this.type === ParameterType.STRING) this.update(this.value, true);
        if ((this.type === ParameterType.NUMBER_ARRAY || this.type === ParameterType.STRING_ARRAY) && this.possibleValues!) {
            const currIndex = this.possibleValues!.indexOf(this.value);
            const indexToSet = Math.min(currIndex + 1, this.possibleValues!.length - 1);
            return this.update(this.possibleValues![indexToSet], true);
        }
        if (this.type === ParameterType.BOOLEAN) this.update(false);
        if (this.type === ParameterType.NUMBER) this.update(Math.round((this.value as number) + this.step! * jumps));
    }

    updatePrevious(jumps: number): any {
        if (this.type === ParameterType.STRING) this.update(this.value, true);
        if ((this.type === ParameterType.NUMBER_ARRAY || this.type === ParameterType.STRING_ARRAY) && this.possibleValues!) {
            const currIndex = this.possibleValues!.indexOf(this.value);
            const indexToSet = Math.max(currIndex - 1, 0);
            return this.update(this.possibleValues![indexToSet], true);
        }
        if (this.type === ParameterType.BOOLEAN) this.update(true);
        if (this.type === ParameterType.NUMBER) this.update(Math.round((this.value as number) - this.step! * jumps));
    }

    /* This overrides the standard update method of the Parameter by adding a few checks before making the update */
    update(newVal: string | boolean | number, forceListenerUpdate?: boolean): any {
        if (this.type === ParameterType.NUMBER) {
            let valToSend: number;
            if (newVal < this.min!) valToSend = this.min!;
            else if (newVal > this.max!) valToSend = this.max!;
            else valToSend = newVal as number;
            return super.update(valToSend, forceListenerUpdate);
        } else if (this.type === ParameterType.NUMBER_ARRAY && this.possibleValues!) {
            if (this.possibleValues!.indexOf(newVal) < 0) {
                //bad update - return existing value
                return super.value;
            }
        } else if (this.type === ParameterType.STRING_ARRAY && this.possibleValues!) {
            if (this.possibleValues!.indexOf(newVal) < 0) {
                //bad update - return existing value
                return super.value;
            }
        }
        super.update(newVal, forceListenerUpdate);
    }

    /* incoming range must be between 0 and 1 */
    updateRanged(newVal: number): any {
        if (this.type !== ParameterType.NUMBER) return super.value;
        const valToSend: number = this.min! + ((this.max! - this.min!) * (newVal - 0)) / (1 - 0);
        let rounded = 0;
        if (valToSend > 0) rounded = Math.ceil(valToSend / this.step!) * this.step!;
        else if (valToSend < 0) rounded = Math.floor(valToSend / this.step!) * this.step!;
        else rounded = this.step!;
        super.update(rounded);
    }

    bindFrom(other: Parameter<any>, valueCallback?: (parameterChangeEvent: ParameterValueChangeEvent<any>) => void, metadataCallback?: (parameterChangeEvent: ParameterMetadataChangeEvent<any>) => void) {
        const currBlueprint = this.blueprint;
        this.updateType(other.blueprint, true);
        try {
            super.bindFrom(other, valueCallback, metadataCallback);
            const nonClassifiedMetadata = this.nonClassifiedMetadata(other);
            const classifiedKeys = Array.from(nonClassifiedMetadata.keys());
            const classifiedValues = Array.from(nonClassifiedMetadata.values());
            this.setMetadataSeveral(BindFromRequestToken, classifiedKeys, classifiedValues, false);
        } catch (err) {
            this.updateType(currBlueprint, true);
        }
    }

    nonClassifiedMetadata(param: Parameter<any>): Map<string, any> {
        const ret = new Map<string, any>();
        param.getAllMetadata().forEach((v, k) => {
            if (!this.classifiedMetadata.includes(k)) ret.set(k, v);
        });
        return ret;
    }
}