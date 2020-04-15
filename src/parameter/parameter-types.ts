import { Parameter } from './parameter';

export class IntegerParameter extends Parameter<number> {
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

export class SuperParameter extends Parameter<any> {
  private min: number | undefined;
  private max: number | undefined;
  private step: number | undefined;
  private type: SuperParameterType;
  private possibleValues: any[] | undefined;

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

  private validateParameterTypeChangeRequest(req: SuperParameterTypeChangeRequest): boolean {
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

  updateType(req: SuperParameterTypeChangeRequest) {
    if (!this.validateParameterTypeChangeRequest(req)) throw new Error('cannot update type due to validation failure');
    if (req.type === SuperParameterType.NUMBER) this.setMinMaxStep(req.min!, req.max!, req.step!, req.value);
    if (req.type === SuperParameterType.NUMBER_ARRAY || req.type === SuperParameterType.STRING_ARRAY) this.setValues(req.values!, req.value);
    if (req.type === SuperParameterType.STRING || req.type === SuperParameterType.BOOLEAN) this.setValueSpecific(req.value);
  }

  private setMinMaxStep(min: number, max: number, step: number, value: number): any {
    this.min = min;
    this.max = max;
    this.step = step;
    this.type = SuperParameterType.NUMBER;
    this.possibleValues = undefined;
    this.setMetadataSeveral(
      SuperParameterTypeChangeRequestToken,
      ['type', 'min', 'max', 'step', 'values'],
      [this.type, this.min, this.max, this.step, undefined]
    );
    return this.update(value);
  }

  private setValues(values: any[], value: any): any {
    this.possibleValues = [];
    values.forEach(v => this.possibleValues!.push(v));
    if (typeof values[0] === 'number') this.type = SuperParameterType.NUMBER_ARRAY;
    else if (typeof values[0] === 'string') this.type = SuperParameterType.STRING_ARRAY;
    this.min = this.max = this.step = undefined;

    this.setMetadataSeveral(
      SuperParameterTypeChangeRequestToken,
      ['type', 'min', 'max', 'step', 'values'],
      [this.type, undefined, undefined, undefined, this.possibleValues]
    );
    return this.update(value);
  }

  private setValueSpecific(value: string | boolean): any {
    if (typeof value === 'string') this.type = SuperParameterType.STRING;
    else if (typeof value === 'boolean') this.type = SuperParameterType.BOOLEAN;
    this.min = this.max = this.step = this.possibleValues = undefined;

    this.setMetadataSeveral(
      SuperParameterTypeChangeRequestToken,
      ['type', 'min', 'max', 'step', 'values'],
      [this.type, undefined, undefined, undefined, undefined]
    );
    return this.update(value);
  }

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
}

export interface SuperParameterTypeChangeRequest {
  type: SuperParameterType;
  min?: number;
  max?: number;
  step?: number;
  value: any;
  values?: any[];
}

export const SuperParameterTypeChangeRequestToken = 'typechangerequest';

export enum SuperParameterType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  NUMBER_ARRAY = 'NUMBER_ARRAY',
  STRING_ARRAY = 'STRING_ARRAY',
}
