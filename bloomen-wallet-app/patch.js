const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';

const f2 = 'node_modules/web3-core-helpers/dist/web3-core-helpers.umd.js';

fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');

  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

// FIX block.gasLimit on Alastria (avoid 53 bytes error)

fs.readFile(f2, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/\(block.gasLimit\)/g, "('0x999999')");

  fs.writeFile(f2, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});