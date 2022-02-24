const fileService = require('./services/file')
const processingService = require('./services/processing')
const path = require('path');
const fs = require('fs');
const inputFilesFolder = path.join(__dirname, '..', 'resources', 'input-files');

fs.readdirSync(inputFilesFolder).forEach((fileName) => {
    console.info("Processing " + fileName);
    const filePathInput = path.join(__dirname, '..', 'resources', 'input-files', fileName);
    const filePathOutput = path.join(__dirname, '..', 'resources', 'output-files', fileName.replace('.txt', '_result.txt'));

    const data = fileService.readFile(filePathInput);

    const result = processingService.process(data);

    fileService.writeFile(filePathOutput, result);

    console.info(fileName + " done");
});
