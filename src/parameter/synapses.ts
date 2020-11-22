import { Parameter } from './parameter';
import { Synapse } from './synapse';

/* A simple registry mechanism used only internally to manage Synapses. */
class SynapsesManager {
  _syanpses = new Map<string, Synapse>();
  constructor() {
    /* anything?*/
  }

  of(param: Parameter<any>): Synapse {
    return this._syanpses.get(param.id)!;
  }

  create(param: Parameter<any>, initValue: any): Synapse {
    const syn = new Synapse(param, initValue);
    this._syanpses.set(param.id, syn);
    return syn;
  }

  set(param: Parameter<any>, newSynapse: Synapse) {
    this._syanpses.set(param.id, newSynapse);
  }
}

export const Synapses = new SynapsesManager();
Object.seal(Synapses);
