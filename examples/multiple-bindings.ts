import { BooleanParameter, NumberParameter, SuperParameter } from "../src";

const stack1 = new SuperParameter("stack1", (e) => console.log("stack1:", e.value));
const stack2 = new SuperParameter("stack2", (e) => console.log("stack2:", e.value));
const target1 = new NumberParameter(0, 0, 100, 1, "target1", (e) => console.log("target1:", e.value));
const target2 = new BooleanParameter(false, "target2", (e) => console.log("target2:", e.value));
const automation = new BooleanParameter(false, "automation", (e) => console.log("automation:", e.value));

stack1.bindFrom(target1);
stack2.bindFrom(target1);
automation.bindFrom(stack1);
// stack2.bindFrom(stack2);

setInterval(() => target1.update(target1.value + 1), 1000);
// setInterval(() => target2.updateCyclic(), 1000);