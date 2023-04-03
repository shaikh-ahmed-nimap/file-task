const jsZip = require('jszip');
const decompress = require('decompress');
const fs = require('fs');


function extractFile(filePath) {
    fs.readdir(filePath, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            files.forEach(file => {
                let name = file.split('.')[0]
                decompress(`./dataset/${file}`, __dirname + `/extracted/${name}`);
            })
        }
    })
};

module.exports = extractFile;
