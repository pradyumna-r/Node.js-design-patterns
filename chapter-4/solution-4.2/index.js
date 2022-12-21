import fs from "node:fs";
import path from "node:path";

function listNestedFiles(dir, cb) {
  const directories = [dir];
  const totalFilesFound = [];
  function next(running) {
    if (directories.length === 0 && running === 0) {
      return cb(null, totalFilesFound);
    }
    while (directories.length > 0) {
      const directory = directories.shift();
      ++running;
      listFilesAndDirectories(directory, (err, result) => {
        if (err) {
          return cb(err);
        }
        if (result.subDirectories) {
          result.subDirectories.forEach((subDirectory) =>
            directories.push(subDirectory)
          );
        }
        if (result.subFiles) {
          result.subFiles.forEach((subFile) => {
            totalFilesFound.push(subFile);
          });
        }
        --running;
        next(running);
      });
    }
  }
  next(0);
}

function listFilesAndDirectories(dir, cb) {
  const dirPath = path.resolve(dir);
  const subFiles = [];
  const subDirectories = [];
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return cb(err);
    }
    if (files.length === 0) {
      return cb(null, { subFiles: null, subDirectories: null });
    }
    let completed = 0;
    files.forEach((file) => {
      const filePath = dirPath + "/" + file;
      isDirectory(filePath, (err, answer) => {
        if (err) {
          return cb(err);
        }
        if (answer) {
          subDirectories.push(filePath);
        } else {
          subFiles.push(filePath);
        }
        if (++completed === files.length) {
          return cb(null, { subFiles, subDirectories });
        }
      });
    });
  });
}

function isDirectory(filePath, cb) {
  fs.lstat(filePath, (err, stats) => {
    if (err) {
      return cb(err);
    }
    if (stats.isDirectory()) {
      return cb(null, true);
    }
    cb(null, false);
  });
}

listNestedFiles("../", (err, totalFilesFound) => {
  if (err) {
    return console.log(err);
  }
  console.log(totalFilesFound, totalFilesFound.length);
});
