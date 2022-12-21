import fs from "node:fs";
import path from "node:path";

function searchDirectoryForMatchingTextFiles(dir, keyword, cb) {
  dir = path.resolve(dir);
  fs.readdir(dir, (err, files) => {
    if (err) {
      return cb(err);
    }
    const textFiles = [];
    const subDirectories = [];
    files.forEach((file) => {
      if (!path.extname(file)) {
        subDirectories.push(dir + "/" + file);
      }
      if (path.extname(file) === ".txt") {
        file = dir + "/" + file;
        textFiles.push(file);
      }
    });
    let completed = 0;
    const matchingFiles = [];
    textFiles.forEach((file) => {
      fs.readFile(file, "utf-8", (err, contents) => {
        if (err) {
          return cb(err);
        }
        ++completed;
        if (contents.includes(keyword)) {
          matchingFiles.push(file);
        }
        if (completed === textFiles.length) {
          console.log("hi");
          return cb(null, matchingFiles, subDirectories);
        }
      });
    });
  });
}
// searchDirectoryForMatchingTextFiles(
//   "../solution-4.1",
//   "foobar",
//   (err, matchingFiles) => {
//     console.log(matchingFiles);
//   }
// );

function recursiveFind(dir, keyword, cb) {
  const directoriesToBeSearched = [dir];
  const matchingFilesFound = [];
  let running = 0;
  let completed = 0;
  let concurrency = 1;
  function next() {
    if (running === 0 && directoriesToBeSearched.length === 0) {
      return process.nextTick(() => {
        cb(null, matchingFilesFound);
      });
    }
    while (running < concurrency) {
      const dir = directoriesToBeSearched.shift();
      searchDirectoryForMatchingTextFiles(
        dir,
        keyword,
        (err, matchingFiles, subDirectories) => {
          if (err) {
            return cb(err);
          }
          --running;
          matchingFilesFound.push(...matchingFiles);
          directoriesToBeSearched.push(...subDirectories);
          next();
        }
      );
      ++running;
    }
    // directoriesToBeSearched.forEach((directoryToBeSearched) => {
    //   ++running;
    //   directoriesToBeSearched.shift();
    //   searchDirectoryForMatchingTextFiles(
    //     directoryToBeSearched,
    //     keyword,
    //     (err, matchingFiles, subDirectories) => {
    //       if (err) {
    //         return cb(err);
    //       }
    //       --running;
    //       matchingFilesFound.push(...matchingFiles);
    //       directoriesToBeSearched.push(...subDirectories);
    //       next();
    //     }
    //   );
    // });
  }
  next();
}
recursiveFind("../solution-4.1", "foo", (err, files) => {
  console.log(files);
});
