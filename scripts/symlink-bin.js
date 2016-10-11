#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const rootBin = '../../node_modules/.bin/';
const packageBin = './node_modules/.bin/';

const forceSymlink = function (target, destination) {
  fs.symlink(target, destination, function (error) {
    if (error) {
      if (error.code === 'EEXIST') {
        fs.unlink(destination, function (error) {
          if (error) {
            throw error;
          }

          forceSymlink(target, destination);
        });
      } else {
        throw error;
      }
    }
  });
};

fs.readdir(rootBin, function (error, files) {
  if (error) {
    throw error;
  }

  files.forEach(function (file) {
    const rootBinPath = path.resolve(rootBin, file);
    const packageBinPath = path.resolve(packageBin, file);

    forceSymlink(rootBinPath, packageBinPath);
  });

  console.log(`Created symlinks for .bin in ${process.cwd()}`);
});
