import { Parameters, ParameterType } from "../src";

const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 150 });
p1.setMetadata('non-classified-key', 'non-classified-value');

p1.addListener(e => {
  if (e.value) console.log(`p1L: ${JSON.stringify(e.value)}`);
  if (e.metadataUpdated) console.log(`p1L: ${JSON.stringify(e.metadataUpdated.key)} set to ${JSON.stringify(e.metadataUpdated.value)}`);
});

setInterval(() => p1.updateCyclic(), 1000);

const p2 = Parameters.newParameter('', 'p2');
p2.updateType({ type: ParameterType.STRING_ARRAY, values: ['a', 'b'], value: 'a' });

const p2L = e => {
  if (e.value) console.log(`p2->p1: ${JSON.stringify(e.value)}`);
  if (e.metadataUpdated) console.log(`p2->p1: ${JSON.stringify(e.metadataUpdated.key)} set to ${JSON.stringify(e.metadataUpdated.value)}`);
};

p2.bindFrom(p1, p2L);

setTimeout(() => p2.unbind(), 5000);
setTimeout(() => p2.bindFrom(p1, p2L), 10000);

let i = 0;
setInterval(() => p1.setMetadata('new', i++), 7000);

// p2.addListener(e => {
//   console.log(`p2Listener: ${JSON.stringify(e)}`);
// });

// p2.setMetadata('hello', 'world');
