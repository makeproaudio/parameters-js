import { Parameter } from './parameter';
import { Synapse } from './synapse';

class SynapsesManager {
  _syanpses = new Map<Parameter<any>, Synapse>();
  constructor() {
    /* anything?*/
  }

  of(param: Parameter<any>): Synapse {
    return this._syanpses.get(param)!;
  }

  create(param: Parameter<any>, initValue: any): Synapse {
    const syn = new Synapse(param, initValue);
    this._syanpses.set(param, syn);
    return syn;
  }

  set(param: Parameter<any>, newSynapse: Synapse) {
    this._syanpses.set(param, newSynapse);
  }
}

export const Synapses = new SynapsesManager();
Object.seal(Synapses);
