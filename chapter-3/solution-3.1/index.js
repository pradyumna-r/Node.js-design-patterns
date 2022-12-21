import { EventEmitter } from "events";
import { readFile } from "fs";
class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }
  addFile(file) {
    this.files.push(file);
    return this;
  }
  find() {
    process.nextTick(() => {
      this.emit("find process started", this.files);
    });
    for (const file of this.files) {
      readFile(file, "utf8", (err, content) => {
        if (err) {
          return this.emit("error", err);
        }
        this.emit("fileread", file);
        const match = content.match(this.regex);
        console.log(match);
        if (match) {
          match.forEach((element) => this.emit("found", file, element));
        }
      });
    }
    return this;
  }
}
const findRegexInstance = new FindRegex(/hello \w+/);
findRegexInstance
  .addFile("test.txt")
  .addFile("test2.txt")
  .find()
  .on("find process started", (files) =>
    console.log(`find process started in the following files:${files}`)
  )
  .on("found", (file, match) => {
    console.log(`found ${match} in file ${file}`);
  })
  .on("error", (err) => console.error(`error emitted ${err.message}`));
