import { Parameter } from "../src";

const p1 = new Parameter("p1");
const p2 = new Parameter("p2", (e) => console.log("persistent p2 listener:", e.value));

p1.bindFrom(p2, (e) => console.log("p1 listener:", e.value));

setInterval(() => p1.updateCyclic(), 1000);

setTimeout(() => {
    p2.unbind();
    setTimeout(() => {
        p1.bindFrom(p2, (e) => console.log("new p1 listener:", e.value));
    }, 3000);
}, 3000)
