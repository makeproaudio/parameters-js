import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BooleanParameter } from './parameter-types/BooleanParameter';
import { IntegerArrayParameter } from './parameter-types/IntegerArrayParameter';
import { NumberParameter } from './parameter-types/NumberParameter';
import { Parameter } from './base/Parameter';
import { StringArrayParameter } from './parameter-types/StringArrayParameter';
import { StringParameter } from './parameter-types/StringParameter';
import { SuperParameter } from './parameter-types/SuperParameter';

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

  numberParameter = (init: number, min: number, max: number, step: number, namespace: string, id: string): NumberParameter => {
    const qualifiedName = this.qualifiedName(namespace, id);
    const param = new NumberParameter(init, min, max, step, this.qualifiedName(namespace, id));
    this.params.set(qualifiedName, param);
    this._stream.next(param);
    return param;
  };

  numberArrayParameter = (init: number, possible: number[], namespace: string, id: string): IntegerArrayParameter => {
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

  /* Gets one or more parameters with a matching id without caring about the namespace from the registry's live map of Parameters */
  getDisregardingNamespace = (id: string): Array<Parameter<any>> => {
    const ret = new Array<Parameter<any>>();
    this.params.forEach((value, key) => {
      if (key.split(this.delimiter)[1] === id) {
        ret.push(value);
      }
    });
    return ret;
  };

  /* Gets the exact parameter with a matching id and namespace from the registry's live map of Parameters */
  getExact = (namespace: string, id: string): Parameter<any> | undefined => this.params.get(this.qualifiedName(namespace, id));

  /* subscribe to parameters that can be created latently based on the filtration criteria */
  subscribe = (
    id: string,
    next?: ((value: Parameter<any>) => void) | undefined,
    error?: ((error: any) => void) | undefined,
    complete?: (() => void) | undefined
  ) => {
    const filtered = this._stream.pipe(filter(p => p.id.split(this.delimiter)[1] === id));
    filtered.subscribe(next, error, complete);
  };

  /* A variation of subscribe where the filtration criteria accepts a prefix for the id of the parameter */
  subscribeLoose = (
    prefix: string,
    next?: ((value: Parameter<any>) => void) | undefined,
    error?: ((error: any) => void) | undefined,
    complete?: (() => void) | undefined
  ) => {
    const filtered = this._stream.pipe(
      filter(p =>
        p
          .id
          .split(this.delimiter)[1]
          .startsWith(prefix)
      )
    );
    filtered.subscribe(next, error, complete);
  };
}

/* Once the SuperParameter came into existence, the classical Parameter types have been deemed to be for internal
 * use only. Hence the only export from the Parameter Registry is the creation process of a SuperParameter.*/
const ParameterRegistry: ParametersRegistry = new ParametersRegistry();
// export const newBooleanParameter = Parameters.booleanParameter;
// export const newStringParameter = Parameters.stringParameter;
// export const newStringArrayParameter = Parameters.stringArrayParameter;
// export const newNumberParameter = Parameters.integerParameter;
// export const newNumberArrayParameter = Parameters.integerArrayParameter;

export const Parameters = {
  newParameter: ParameterRegistry.superParameter,
  getExact: ParameterRegistry.getExact,
  subscribe: ParameterRegistry.subscribe,
  subscribeLoose: ParameterRegistry.subscribeLoose,
  getDisregardingNamespace: ParameterRegistry.getDisregardingNamespace,
};

Object.freeze(ParameterRegistry);
