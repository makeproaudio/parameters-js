const { Parameters, ParameterType } = require('..');
const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 100 });

const l1 = e => {
  console.log(`l1 listener: ${e.value}`);
};

const l2 = e => {
  console.log(`l2 listener: ${e.value}`);
};

p1.addListener(l1);
p1.addListener(l2);

setInterval(() => p1.updateCyclic(), 1000);

setTimeout(() => {
  p1.removeListener(l1);
}, 5000);

setTimeout(() => {
  p1.addListener(l1);
}, 10000);
