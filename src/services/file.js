const fs = require('fs');

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
}

function writeFile(filePath, lines) {
  const data = lines.join('\n')
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(filePath + ' was written');
  });
}

module.exports = { readFile, writeFile };
