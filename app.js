const XLSX = require('xlsx');
const {utils} = require('xlsx');
const fs = require('fs');
const Details = require("./combineDetailsModel");

// Reading xlsx file
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

// Reading csv File
const workbook2 = XLSX.readFile('./tblDataKeyValues2303091100510.csv');
const ws2 = workbook2.Sheets['Sheet1'];

const csvToJson = utils.sheet_to_json(ws2);

Details.sync({alter: true}).then(() => {
    console.log('Table synced');
    return enterIntoDatabase();

})
.then(result => {
    fs.writeFileSync('./result.json', JSON.stringify(result));
})
.catch(err => {
    console.log('Something went wrong while syncing a table', err);
})

async function enterIntoDatabase () {
    let result = [];
    // for (let i in csvToJson) {
    //     let obj = csvToJson[i];
    //     if (Number(obj['Amount']) === 0) {
    //         continue;
    //     }
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
        // for (let j in data) {
        //     // const filterData = result.find((each) => Number(each['xlAmount']) === Number(data[j]['Amount']) && Number(each['csvAmount']) === Number(obj['Amount']));
        //     // if (filterData) {
        //     //     continue;
        //     // } else
            
        //     if (Number(obj['Amount']) == Number(data[j]['Amount'])) {
        //         console.log(obj['DrillDownDesc'])
                
        //         // try {
        //         //     const data = await Details.create(resultObj);
        //         //     result.push(data);
        //         // } catch(err) {
        //         //     console.log('Error', err);
        //         // };
        //     }
        // }
    // }
        for (let row in csvToJson) {
            let obj = csvToJson[row];
            if (obj['Amount'] == 0) {
                continue;
            }
            for (let xlRow in data) {
                let xlAmount = typeof data[xlRow].Amount === 'string' ? data[xlRow]['Amount'].split(',').join('') : data[xlRow]['Amount']
                // console.log(xlAmount)
                if (obj['Amount'] == xlAmount) {
                    let resultObj = {index: row,xlDataKey: data[xlRow]['VALUE_KEY'], xlAmount: xlAmount, 'csvDataKey': obj['DataKey'], csvAmount: obj['Amount'], 'DrillDownDesc': obj['DrillDownDesc'] ?  obj['DrillDownDesc'] : null}
                    try {
                        const data = await Details.create(resultObj);
                        result.push(data);
                    } catch (e) {
                        console.log(e);
                        throw e;
                    }
                }
            }
        }
    return result;
};





