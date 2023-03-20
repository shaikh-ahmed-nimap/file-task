const XLSX = require('xlsx');
const {utils} = require('xlsx');
const fs = require('fs');
const workbook = XLSX.readFile('./Sample.xlsx');
const ws = workbook.Sheets['Sheet1'];

const count = utils.decode_range(ws['!ref']);
const rowCount = count.e.r;

const startingIndex = 8;
const endingIndex = rowCount + 1;

let headers = ['VALUE_KEY', 'Amount']
let obj = {};
let data = [];
for(let i = startingIndex; i < endingIndex; i++) {
    if (ws[`B${i}`] && ws[`F${i}`]) {
        key = ws[`B${i}`].v;
        amount = ws[`F${i}`].v;
        obj[headers[0]] = key;
        obj[headers[1]] = amount;
        data.push(obj);
        obj = {};
    }
};

const workbook2 = XLSX.readFile('./tblDataKeyValues2303091100510.csv');
const ws2 = workbook2.Sheets['Sheet1'];

const csvToJson = utils.sheet_to_json(ws2);
let result = [];

for (let i in csvToJson) {
    let obj = csvToJson[i];
    // let filterData = result.find((each) => Number(each['csvAmount']) === Number(obj['Amount']));
    // if (filterData) {
    //     continue;
    // };
    // for (let j in data) {
    //     if (Number(data[j]['Amount']) === Number(obj['Amount'])) {
    //         result.push({DataKey: obj['DataKey'], xlKey: data[j]['VALUE_KEY'], csvAmount: Number(obj['Amount']), xlAmount: Number(data[j]['Amount'])})
    //         break;
    //     };
    // }
    for (let j in data) {
        const filterData = result.find((each) => Number(each['xlAmount']) === Number(data[j]['Amount']) && Number(each['csvAmount']) === Number(obj['Amount']));
        if (filterData) {
            continue;
        } else if (Number(obj['Amount']) === Number(data[j]['Amount'])) {
            result.push({index: i,xlDataKey: data[j]['VALUE_KEY'], xlAmount: Number(data[j]['Amount']), 'csvDataKey': obj['DataKey'], csvAmount: obj['Amount'], 'DrillDownDesc': obj['DrillDownDesc'] ?  obj['DrillDownDesc'] : "Not Found"});
            break;
        }
    }
};

fs.writeFileSync('./result.json', JSON.stringify(result));



