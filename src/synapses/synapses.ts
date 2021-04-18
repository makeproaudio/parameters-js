import { Parameter } from '../base/Parameter';
import { Synapse } from './synapse';

/* A simple registry mechanism used only internally to manage Synapses. */
class SynapsesManager {
  private _synapses = new Map<string, Synapse>();

  of(param: Parameter<any>): Synapse {
    return this._synapses.get(param.id)!;
  }

  create(param: Parameter<any>, initValue: any): Synapse {
    const syn = new Synapse(param, initValue);
    this._synapses.set(param.id, syn);
    return syn;
  }

  set(param: Parameter<any>, newSynapse: Synapse) {
    this._synapses.set(param.id, newSynapse);
  }
}

export let Synapses = new SynapsesManager();

export function setSynapsesManager(s: SynapsesManager): void {
  Synapses = s;
}

export function getSynapsesManager(): SynapsesManager {
  return Synapses;
}

