import fs from "node:fs";

function concatFiles(dest, cb, ...srcFiles) {
  let result = "";
  function iterate(index) {
    if (index === srcFiles.length) {
      return finish();
    }
    fs.readFile(srcFiles[index], "utf-8", (err, data) => {
      if (err) {
        return cb(err);
      }
      result += data;
      iterate(index + 1);
    });
  }
  function finish() {
    fs.writeFile(dest, result, (err) => {
      if (err) {
        console.log("couldnt write data to the destination file");
      } else {
        console.log("data written to the destination file");
      }
    });
  }
  iterate(0);
}

concatFiles(
  "./dest.txt",
  (err) => {
    console.log(err);
  },
  "./file1.txt",
  "./file2.txt"
);
