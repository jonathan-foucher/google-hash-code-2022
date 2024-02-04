const fileService = require('./services/file')
const processingService = require('./services/processing')
const path = require('path');
const fs = require('fs');
const inputFilesFolder = path.join(__dirname, '..', 'resources', 'input-files');

const formatProcessingTime = (msDiff) => {
    const minutes = Math.floor(msDiff / 60000);
    const seconds = Math.floor(msDiff / 1000) % 60;
    const milliseconds = msDiff % 60000;
    return `${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;
}

fs.readdirSync(inputFilesFolder).forEach((fileName) => {
    const startTime = new Date();
    console.info("Processing " + fileName);
    const filePathInput = path.join(__dirname, '..', 'resources', 'input-files', fileName);
    const filePathOutput = path.join(__dirname, '..', 'resources', 'output-files', fileName.replace('.txt', '_result.txt'));

    const data = fileService.readFile(filePathInput);

    const result = processingService.process(data);

    fileService.writeFile(filePathOutput, result);

    console.info(fileName + " done in " + formatProcessingTime(new Date() - startTime));
});
