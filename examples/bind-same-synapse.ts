import { KnownParameterMetadata, Parameters, ParameterType, ParameterValueChangeEvent } from "../src";

const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ [KnownParameterMetadata.TYPE]: ParameterType.NUMBER, [KnownParameterMetadata.MIN]: 100, [KnownParameterMetadata.MAX]: 200, [KnownParameterMetadata.STEP]: 1, value: 100 });

const p2 = Parameters.newParameter('', 'p2');
p2.updateType({ [KnownParameterMetadata.TYPE]: ParameterType.NUMBER, [KnownParameterMetadata.MIN]: 100, [KnownParameterMetadata.MAX]: 200, [KnownParameterMetadata.STEP]: 1, value: 150 });

p2.bindFrom(p1, (e: ParameterValueChangeEvent<any>) => {
  console.log(`p2->p1: ${e.value}`);
});

const p3 = Parameters.newParameter('', 'p3');
p3.updateType({ [KnownParameterMetadata.TYPE]: ParameterType.NUMBER, [KnownParameterMetadata.MIN]: 100, [KnownParameterMetadata.MAX]: 200, [KnownParameterMetadata.STEP]: 1, value: 150 });

p3.bindFrom(p2, (e: ParameterValueChangeEvent<any>) => {
  console.log(`p3->p2: ${e.value}`);
});

/* Should fail */
p3.bindFrom(p2, (e: ParameterValueChangeEvent<any>) => {
  console.log(`Another p3->p2: ${e.value}`);
});

/* Should fail */
p2.bindFrom(p3, (e: ParameterValueChangeEvent<any>) => {
  console.log(`Cyclic p3->p2: ${e.value}`);
});

setInterval(() => p3.updateCyclic(), 1000);
setTimeout(() => p3.unbind(), 5000);
