import { EventEmitter } from "node:events";
const emitter = new EventEmitter();

function ticker(number, cb) {
  let numberOfTicks = 0;
  const intervalObj = setInterval(() => {
    emitter.emit("tick");
    numberOfTicks++;
    if (numberOfTicks * 50 >= number) {
      clearInterval(intervalObj);
      cb(numberOfTicks);
    }
  }, 50);
  return emitter;
}

ticker(500, function (ticks) {
  console.log(ticks);
}).on("tick", () => console.log("tick"));
