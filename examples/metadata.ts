import { ParameterMetadataChangeEvent, Parameters, SuperParameterType, ParameterValueChangeEvent } from "../src";

const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ type: SuperParameterType.NUMBER, min: 100, max: 200, step: 1, value: 150 });
p1.setMetadata('non-classified-key', 'non-classified-value');

p1.addValueListener((e: ParameterValueChangeEvent<any>) => {
  console.log(`p1L:`, e.value);
});
p1.addMetadataListener((e: ParameterMetadataChangeEvent<any>) => {
  console.log(`p1L:`, e.metadataUpdated?.key, `set to`, e.metadataUpdated?.value);
});

setInterval(() => p1.updateCyclic(), 1000);

const p2 = Parameters.newParameter('', 'p2');
p2.updateType({ type: SuperParameterType.STRING_ARRAY, values: ['a', 'b'], value: 'a' });

const p2L = (e: ParameterValueChangeEvent<any>) => {
  console.log(`p2->p1:`, e.value);
};
const p2Lm = (e: ParameterMetadataChangeEvent<any>) => {
  console.log(`p2->p1:`, e.metadataUpdated?.key, `set to`, e.metadataUpdated?.value);
};

p2.bindFrom(p1, p2L, p2Lm);

setTimeout(() => p2.unbind(), 5000);
setTimeout(() => p2.bindFrom(p1, p2L, p2Lm), 10000);

let i = 0;
setInterval(() => p1.setMetadata('new', i++), 7000);

// p2.addListener(e => {
//   console.log(`p2Listener: ${JSON.stringify(e)}`);
// });

// p2.setMetadata('hello', 'world');
