import { BooleanParameter, NumberParameter, SuperParameter } from "../src";

const uiScreenStack = new SuperParameter("uiScreenStack", (e) => console.log("uiScreen stack:", e.value));
const feature = new NumberParameter(0, 0, 100, 1, "feature", (e) => console.log("feature:", e.value));
const hw1Stack = new SuperParameter("hw1Stack", (e) => console.log("hw1Stack:", e.value));
const hw2Stack = new SuperParameter("hw2Stack", (e) => console.log("hw2Stack:", e.value));

uiScreenStack.bindFrom(feature);
hw1Stack.bindFrom(feature);
hw2Stack.bindFrom(feature);

setInterval(() => hw2Stack.update(hw1Stack.value + 1), 1000);
// setInterval(() => target2.updateCyclic(), 1000);