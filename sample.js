const {finToJson, excelToJson} = require("./convertToJson");
const fs = require('fs');

// const xlFile = excelToJson('./exceldata/050323.xlsx');
// const xlFile = excelToJson('./Sample.xlsx');
// const csvFile = finToJson('tblDataKeyValues2303091100510.csv');
// let xlHeaders = xlFile.filter((each) => {
//     if (each.DataKey && (each.Qty == '' || typeof each.Qty == 'undefined') && (each['Amount'] == '' || typeof each['Amount'] == 'undefined') && (each['%'] == '' || typeof each['%'] == 'undefined')) {
//         return each.DataKey;
//     }
// });

/*
    mapping = [
        {

        }
    ]
 */

// for (let i of csvFile) {
//     for (let j of xlFile) {
//         if (i['DrillDownDesc'] && j['DataKey'] && i['DrillDownDesc'] == (j['DataKey'].startsWith('-') || j['DataKey'].startsWith('+') ? j['DataKey'].substring(2) : j['DataKey'])) {
//             console.log(i, j)
//         }
//     }
// };

let files = fs.readdirSync('./json');

files.forEach((each) => {
    let content = JSON.parse(fs.readFileSync(`./json/${each}`));
    for (let i of content) {
        if (i['xlDataKey'] == 'GROSS SALES') {
            console.log(i)
        }
    }
})






