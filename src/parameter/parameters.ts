import { Parameter } from './parameter';
import { IntegerParameter, StringParameter, IntegerArrayParameter, StringArrayParameter, BooleanParameter, SuperParameter } from './parameter-types';
import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

class ParametersRegistry {
  // tslint:disable-next-line: no-any
  private params: Map<string, Parameter<any>> = new Map();
  private delimiter = '.';
  private _stream: ReplaySubject<Parameter<any>>;

  constructor() {
    // tslint:disable-next-line: no-any
    this._stream = new ReplaySubject<Parameter<any>>();
  }

  private qualifiedName = (namespace: string, id: string): string => {
    return namespace.concat(this.delimiter).concat(id);
  };

  integerParameter = (init: number, min: number, max: number, namespace: string, id: string): IntegerParameter => {
    const qualifiedName = this.qualifiedName(namespace, id);
    const param = new IntegerParameter(init, min, max, this.qualifiedName(namespace, id));
    this.params.set(qualifiedName, param);
    this._stream.next(param);
    return param;
  };

  integerArrayParameter = (init: number, possible: number[], namespace: string, id: string): IntegerArrayParameter => {
    const qualifiedName = this.qualifiedName(namespace, id);
    const param = new IntegerArrayParameter(init, possible, this.qualifiedName(namespace, id));
    this.params.set(qualifiedName, param);
    this._stream.next(param);
    return param;
  };

  stringParameter = (init: string, namespace: string, id: string): StringParameter => {
    const qualifiedName = this.qualifiedName(namespace, id);
    const param = new StringParameter(init, this.qualifiedName(namespace, id));
    this.params.set(qualifiedName, param);
    this._stream.next(param);
    return param;
  };

  stringArrayParameter = (init: string, possible: string[], namespace: string, id: string): StringArrayParameter => {
    const qualifiedName = this.qualifiedName(namespace, id);
    const param = new StringArrayParameter(init, possible, this.qualifiedName(namespace, id));
    this.params.set(qualifiedName, param);
    this._stream.next(param);
    return param;
  };

  booleanParameter = (init: boolean, namespace: string, id: string): BooleanParameter => {
    const qualifiedName = this.qualifiedName(namespace, id);
    const param = new BooleanParameter(init, this.qualifiedName(namespace, id));
    this.params.set(qualifiedName, param);
    this._stream.next(param);
    return param;
  };

  superParameter = (namespace: string, id: string): SuperParameter => {
    const qualifiedName = this.qualifiedName(namespace, id);
    const param = new SuperParameter(this.qualifiedName(namespace, id));
    this.params.set(qualifiedName, param);
    this._stream.next(param);
    return param;
  };

  // tslint:disable-next-line: no-any
  getDisregardingNamespace = (id: string): Array<Parameter<any>> => {
    // tslint:disable-next-line: no-any
    const ret = new Array<Parameter<any>>();
    this.params.forEach((value, key) => {
      if (key.split(this.delimiter)[1] === id) {
        ret.push(value);
      }
    });
    return ret;
  };

  // tslint:disable-next-line: no-any
  getExact = (namespace: string, id: string): Parameter<any> | undefined => this.params.get(this.qualifiedName(namespace, id));

  subscribe = (
    id: string,
    next?: ((value: Parameter<any>) => void) | undefined,
    error?: ((error: any) => void) | undefined,
    complete?: (() => void) | undefined
  ) => {
    const filtered = this._stream.pipe(filter(p => p.id().split(this.delimiter)[1] === id));
    filtered.subscribe(next, error, complete);
  };

  subscribeLoose = (
    prefix: string,
    next?: ((value: Parameter<any>) => void) | undefined,
    error?: ((error: any) => void) | undefined,
    complete?: (() => void) | undefined
  ) => {
    const filtered = this._stream.pipe(
      filter(p =>
        p
          .id()
          .split(this.delimiter)[1]
          .startsWith(prefix)
      )
    );
    filtered.subscribe(next, error, complete);
  };
}

const Parameters: ParametersRegistry = new ParametersRegistry();
// export const newBooleanParameter = Parameters.booleanParameter;
// export const newStringParameter = Parameters.stringParameter;
// export const newStringArrayParameter = Parameters.stringArrayParameter;
// export const newNumberParameter = Parameters.integerParameter;
// export const newNumberArrayParameter = Parameters.integerArrayParameter;
export const newParameter = Parameters.superParameter;

Object.freeze(Parameters);
