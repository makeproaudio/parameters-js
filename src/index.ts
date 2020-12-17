import * as Parameters from './parameter/parameters';

import {
  SuperParameter as Parameter,
  SuperParameterType as ParameterType,
  SuperParameterTypeChangeRequestToken as ParameterTypeChangeRequestToken,
  SuperParameterBlueprint as ParameterBlueprint,
  BindFromRequestToken,
} from './parameter/parameter-types';

import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from './parameter/parameter';
import { getSynapsesManager, setSynapsesManager } from './parameter/synapses';

export { Parameters };
export { Parameter, ParameterType, ParameterTypeChangeRequestToken, ParameterBlueprint, BindFromRequestToken };
export { ParameterValueChangeEvent, ParameterMetadataChangeEvent };
export { getSynapsesManager, setSynapsesManager };
