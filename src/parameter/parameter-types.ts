import { Parameter, ParameterChangeEvent } from './parameter';

export class NumberParameter extends Parameter<number> {
  private min: number;
  private max: number;

  constructor(initValue: number, min: number, max: number, id: string) {
    super(initValue, id);
    this.min = min;
    this.max = max;
  }

  update(newVal: number): number {
    let valToSend: number;
    if (newVal < this.min) valToSend = this.min;
    else if (newVal > this.max) valToSend = this.max;
    else valToSend = newVal;
    return super.update(valToSend);
  }
}

export abstract class ArrayParameter<T> extends Parameter<T> {
  private possibleValues: T[];
  constructor(initValue: T, possibleValues: T[], id: string) {
    super(initValue, id);
    this.possibleValues = possibleValues;
  }
}

export class IntegerArrayParameter extends ArrayParameter<number> {
  constructor(initValue: number, possibleValues: number[], id: string) {
    super(initValue, possibleValues, id);
  }
}

export class StringParameter extends Parameter<string> {
  constructor(initValue: string, id: string) {
    super(initValue, id);
  }
}

export class StringArrayParameter extends ArrayParameter<string> {
  constructor(initValue: string, possibleValues: string[], id: string) {
    super(initValue, possibleValues, id);
  }
}

export class BooleanParameter extends Parameter<boolean> {
  constructor(initValue: boolean, id: string) {
    super(initValue, id);
  }
}

/* The Super Parameter works on a few pre-defined conventions*/
export class SuperParameter extends Parameter<any> {
  /* All of the properties below are "possibly" undefined, because depending on the arguments
   * supplied at the time of updating the parameter type, the SuperParameter may behave differently. */
  private min: number | undefined;
  private max: number | undefined;
  private step: number | undefined;
  private type: SuperParameterType;
  private possibleValues: any[] | undefined;
  private classifiedMetadata = ['type', 'min', 'max', 'step', 'values'];

  getMin(): number | undefined {
    return this.min;
  }

  getMax(): number | undefined {
    return this.max;
  }

  getStep(): number | undefined {
    return this.step;
  }

  getType(): SuperParameterType {
    return this.type;
  }

  getPossibleValues(): any[] | undefined {
    return this.possibleValues;
  }

  getBlueprint(): SuperParameterBlueprint {
    switch (this.type) {
      case SuperParameterType.BOOLEAN:
        return { type: this.type, value: this.value() };
      case SuperParameterType.NUMBER:
        return { type: this.type, max: this.max, min: this.min, step: this.step, value: this.value() };
      case SuperParameterType.NUMBER_ARRAY:
        return { type: this.type, values: this.possibleValues, value: this.value() };
      case SuperParameterType.STRING:
        return { type: this.type, value: this.value() };
      case SuperParameterType.STRING_ARRAY:
        return { type: this.type, values: this.possibleValues, value: this.value() };
      default:
        return { type: this.type, value: this.value() };
    }
  }

  /* By default, a freshly constructed SuperParameter will be of type boolean. This is done to 
  * channel the type updation of a SuperParameter through the TypeChangeRequest only and to keep
  the process of creation simplistic ƒ*/
  constructor(id: string) {
    super(false, id);
    this.type = SuperParameterType.BOOLEAN;
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
  private validateParameterTypeChangeRequest(req: SuperParameterBlueprint): boolean {
    switch (req.type) {
      case SuperParameterType.BOOLEAN:
        if (req.max === undefined && req.min === undefined && req.step === undefined && req.values === undefined) {
          if (typeof req.value === 'boolean') {
            return true;
          }
        }
        return false;
      case SuperParameterType.NUMBER:
        if (req.max !== undefined && req.min !== undefined && req.step !== undefined && req.values === undefined) {
          if (typeof req.value === 'number') {
            return true;
          }
        }
        return false;
      case SuperParameterType.NUMBER_ARRAY:
        if (req.max === undefined && req.min === undefined && req.step === undefined && req.values !== undefined) {
          if (req.values.length > 0) {
            if (this.areAllOfSameType(req.values, 'number')) {
              return true;
            }
          }
        }
        return false;
      case SuperParameterType.STRING:
        if (req.max === undefined && req.min === undefined && req.step === undefined && req.values === undefined) {
          if (typeof req.value === 'string') {
            return true;
          }
        }
        return false;
      case SuperParameterType.STRING_ARRAY:
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
  updateType(req: SuperParameterBlueprint, secretly?: boolean) {
    if (!this.validateParameterTypeChangeRequest(req)) throw new Error('cannot update type due to validation failure');
    if (req.type === SuperParameterType.NUMBER) this.setMinMaxStep(req.min!, req.max!, req.step!, req.value, secretly);
    if (req.type === SuperParameterType.NUMBER_ARRAY || req.type === SuperParameterType.STRING_ARRAY) this.setValues(req.values!, req.value, secretly);
    if (req.type === SuperParameterType.STRING || req.type === SuperParameterType.BOOLEAN) this.setValueSpecific(req.value, secretly);
  }

  private setMinMaxStep(min: number, max: number, step: number, value: number, secretly?: boolean): any {
    this.min = min;
    this.max = max;
    this.step = step;
    this.type = SuperParameterType.NUMBER;
    this.possibleValues = undefined;
    this.setMetadataSeveral(SuperParameterTypeChangeRequestToken, this.classifiedMetadata, [this.type, this.min, this.max, this.step, undefined], secretly);
    return this.update(value);
  }

  private setValues(values: any[], value: any, secretly?: boolean): any {
    this.possibleValues = [];
    values.forEach(v => this.possibleValues!.push(v));
    if (typeof values[0] === 'number') this.type = SuperParameterType.NUMBER_ARRAY;
    else if (typeof values[0] === 'string') this.type = SuperParameterType.STRING_ARRAY;
    this.min = this.max = this.step = undefined;
    this.setMetadataSeveral(
      SuperParameterTypeChangeRequestToken,
      this.classifiedMetadata,
      [this.type, undefined, undefined, undefined, this.possibleValues],
      secretly
    );
    return this.update(value);
  }

  private setValueSpecific(value: string | boolean, secretly?: boolean): any {
    if (typeof value === 'string') this.type = SuperParameterType.STRING;
    else if (typeof value === 'boolean') this.type = SuperParameterType.BOOLEAN;
    this.min = this.max = this.step = this.possibleValues = undefined;
    this.setMetadataSeveral(SuperParameterTypeChangeRequestToken, this.classifiedMetadata, [this.type, undefined, undefined, undefined, undefined], secretly);
    return this.update(value);
  }

  /* The SuperParameter ecosystem provides more convenient ways to update the value of a Parameter.
   * Depending on the current type of the Parameter, updateCyclic could do one of several things */
  updateCyclic(): any {
    if (this.type === SuperParameterType.STRING) this.update(this.value(), true);
    if ((this.type === SuperParameterType.NUMBER_ARRAY || this.type === SuperParameterType.STRING_ARRAY) && this.possibleValues) {
      const currIndex = this.possibleValues.indexOf(this.value());
      const indexToSet = (currIndex + 1) % this.possibleValues.length;
      return this.update(this.possibleValues[indexToSet], true);
    }
    if (this.type === SuperParameterType.BOOLEAN) this.update(!this.value());
    if (this.type === SuperParameterType.NUMBER) {
      const nextValue = (this.value() as number) + this.step!;
      if (nextValue > this.max!) {
        this.update(this.min!);
      } else {
        this.update(nextValue);
      }
    }
  }

  updateNext(jumps: number): any {
    if (this.type === SuperParameterType.STRING) this.update(this.value(), true);
    if ((this.type === SuperParameterType.NUMBER_ARRAY || this.type === SuperParameterType.STRING_ARRAY) && this.possibleValues) {
      const currIndex = this.possibleValues.indexOf(this.value());
      const indexToSet = Math.min(currIndex + 1, this.possibleValues.length - 1);
      return this.update(this.possibleValues[indexToSet], true);
    }
    if (this.type === SuperParameterType.BOOLEAN) this.update(false);
    if (this.type === SuperParameterType.NUMBER) this.update(Math.round((this.value() as number) + this.step! * jumps));
  }

  updatePrevious(jumps: number): any {
    if (this.type === SuperParameterType.STRING) this.update(this.value(), true);
    if ((this.type === SuperParameterType.NUMBER_ARRAY || this.type === SuperParameterType.STRING_ARRAY) && this.possibleValues) {
      const currIndex = this.possibleValues.indexOf(this.value());
      const indexToSet = Math.max(currIndex - 1, 0);
      return this.update(this.possibleValues[indexToSet], true);
    }
    if (this.type === SuperParameterType.BOOLEAN) this.update(true);
    if (this.type === SuperParameterType.NUMBER) this.update(Math.round((this.value() as number) - this.step! * jumps));
  }

  /* This overrides the standard update method of the Parameter by adding a few checks before making the update */
  update(newVal: string | boolean | number, forceListenerUpdate?: boolean): any {
    if (this.type === SuperParameterType.NUMBER) {
      let valToSend: number;
      if (newVal < this.min!) valToSend = this.min!;
      else if (newVal > this.max!) valToSend = this.max!;
      else valToSend = newVal as number;
      return super.update(valToSend, forceListenerUpdate);
    } else if (this.type === SuperParameterType.NUMBER_ARRAY && this.possibleValues) {
      if (this.possibleValues.indexOf(newVal) < 0) {
        //bad update - return existing value
        return super.value();
      }
    } else if (this.type === SuperParameterType.STRING_ARRAY && this.possibleValues) {
      if (this.possibleValues.indexOf(newVal) < 0) {
        //bad update - return existing value
        return super.value();
      }
    }
    super.update(newVal, forceListenerUpdate);
  }

  /* incoming range must be between 0 and 1 */
  updateRanged(newVal: number): any {
    if (this.type !== SuperParameterType.NUMBER) return super.value();
    const valToSend: number = this.min! + ((this.max! - this.min!) * (newVal - 0)) / (1 - 0);
    let rounded = 0;
    if (valToSend > 0) rounded = Math.ceil(valToSend / this.step!) * this.step!;
    else if (valToSend < 0) rounded = Math.floor(valToSend / this.step!) * this.step!;
    else rounded = this.step!;
    super.update(rounded);
  }

  bindFrom(other: SuperParameter, callback: (parameterChangeEvent: ParameterChangeEvent<any>) => void) {
    const currBlueprint = this.getBlueprint();
    this.updateType(other.getBlueprint(), true);
    try {
      super.bindFrom(other, callback);
      const nonClassifiedMetadata = this.nonClassifiedMetadata(other);
      const classifiedKeys = Array.from(nonClassifiedMetadata.keys());
      const classifiedValues = Array.from(nonClassifiedMetadata.values());
      this.setMetadataSeveral(BindFromRequestToken, classifiedKeys, classifiedValues, false);
    } catch (err) {
      this.updateType(currBlueprint, true);
    }
  }

  nonClassifiedMetadata(param: SuperParameter): Map<string, any> {
    const ret = new Map<string, any>();
    param.getAllMetadata().forEach((v, k) => {
      if (!this.classifiedMetadata.includes(k)) ret.set(k, v);
    });
    return ret;
  }
}

export interface SuperParameterBlueprint {
  type: SuperParameterType;
  min?: number;
  max?: number;
  step?: number;
  value: any;
  values?: any[];
}

export const SuperParameterTypeChangeRequestToken = 'typechangerequest';
export const BindFromRequestToken = 'bindfromrequest';

export enum SuperParameterType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  NUMBER_ARRAY = 'NUMBER_ARRAY',
  STRING_ARRAY = 'STRING_ARRAY',
}
