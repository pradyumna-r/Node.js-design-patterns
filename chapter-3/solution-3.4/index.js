import { EventEmitter } from "node:events";
const emitter = new EventEmitter();

function ticker(number, cb) {
  process.nextTick(() => {
    if (Date.now() % 5 === 0) {
      emitter.emit("error");
      cb(new Error("timestamp divisible by 5", undefined));
    } else {
      emitter.emit("tick");
    }
  });
  let numberOfTicks = 0;
  const intervalObj = setInterval(() => {
    if (Date.now() % 5 === 0) {
      emitter.emit("error");
      cb(new Error("timestamp divisible by 5", undefined));
    } else {
      emitter.emit("tick");
      numberOfTicks++;
      if (numberOfTicks * 50 >= number) {
        clearInterval(intervalObj);
        cb(numberOfTicks);
      }
    }
  }, 50);
  return emitter;
}

ticker(300, function (error, ticks) {
  if (error) {
    return console.log(error);
  }
  console.log(ticks);
})
  .on("tick", () => console.log("tick"))
  .on("error", () => console.log("timestamp divisible by 5 error emitted"));
