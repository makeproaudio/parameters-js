const { Parameters, ParameterType } = require('..');
const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 100 });

const p2 = Parameters.newParameter('', 'p2');
p2.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 150 });

p2.bindFrom(p1, e => {
  console.log(`p2->p1: ${JSON.stringify(e)}`);
});

p2.addListener(e => {
  console.log(`p2Listener: ${JSON.stringify(e)}`);
});

p1.addListener(e => {
  console.log(`p1Listener: ${JSON.stringify(e)}`);
});

p1.setMetadata('hello', 'world');
