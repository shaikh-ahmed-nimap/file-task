const fs = require('fs');
const xl = require('xlsx');

fs.readdir('./extracted', (err, folders) => {
    if (err) {
        console.log(err);
    } else {
        folders.forEach(folder => {
            fs.readdir(`./extracted/${folder}`, (err, files) => {
                const file = files.find((file) => file.includes('DataKeyValues'));
                console.log(file);
                const content = fs.readFileSync(`${__dirname}/extracted/${folder}/${file}`, 'utf-8');
                // let contentsArr = content.split(/[,\r\n]/);
                // let headers = contentsArr.slice(0, 6);
                // console.log(contentsArr)
                const rows = content.split('\n');
                let headers = rows[0].split(',').map((each) => each.replace(/["\r]/, ''));
                let result = [];
                for (let i = 1; i < rows.length; i++) {
                    let obj = {};
                    const values = rows[i].split(',');
                    for (let j = 0; j < headers.length; j++) {
                        console.log(values[j])
                        obj[(headers[j])] = values[j] ? values[j].replace(/["\r]/, '') : values[j]
                    };
                    result.push(obj);
                }
                fs.writeFile(`${__dirname}/json/${file.split('.')[0]}.json`, JSON.stringify(result), (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            })
        })
    }
})