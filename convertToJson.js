const xl = require('xlsx');
const fs = require("fs");
const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function excelToJson(file) {
    let wb = xl.readFile(file);
    let ws = wb.Sheets[wb.SheetNames[0]];
    let starting = Number(getStartingPoint(ws));
    let end = xl.utils.decode_range(ws['!ref']).e.r;
    // console.log(starting, end)
    let headers = getHeaders(ws, starting);
    // console.log(headers);
    let headerCols = Object.keys(headers);
    // console.log(headerCols, headers);
    let result = [];
    for (let i = starting + 2; i < end; i++) {
        let obj = {};
        for (let col of headerCols) {
            // console.log(col + i, ws[col + i])
            if (ws[col+i]) {
                obj[headers[col]] = ws[col + i].v
            }
        };
        // console.log(obj)
        result.push(obj)
    }
    return result
};

function getStartingPoint (worksheet) {
    let starting;
    for(let cell in worksheet) {
        if (worksheet[cell].v === 'Qty') {
            starting = cell.split('').filter((each) => !isNaN(each)).join('');
        }
    };
    return starting;
};

function getHeaders(ws, starting) {
    let headers = {};
    for(let cell in ws) {
        let row = cell.split('').filter((each) => !isNaN(each)).join('');
        let cols = cell.split('').filter((each) => isNaN(each)).join('');
        if (row == starting) {
            if (!Object.values(headers).includes(ws[cell].v)) {
                if (ws[cell] && ws[cell].v != '') {
                    headers[cols] = ws[cell].v
                }
            };
            if (!ws[`B${row}`] || (ws[`B${row}`] && ws[`B${row}`].v == '')) {
                headers[`B`] = 'DataKey'
            }
        }
    }
    return headers;
}

// excelToJson('./exceldata/060323.xlsx')

// FIN TO JSON
function finToJson(file) {
    const content = fs.readFileSync(file, 'utf-8');
    let result = [];
    let rows = content.split('\n');
    let headers = rows[0].split(',').map((each) => each.replace(/"/, '').replace(/"/, '').replace(/\r/, ''));
    for (let row = 1; row < rows.length; row++) {
        let obj = {};
        let ele = rows[row].split(',').map((each) => each.replace(/\r/, ''));
        for (let i = 0; i < ele.length; i++) {
            obj[headers[i]] = ele[i];
        };
        result.push(obj);
    };
    return result;
};

// finToJson('./extracted/2302041100510/tblDataKeyValues2302041100510.fin')

module.exports = {excelToJson, finToJson};