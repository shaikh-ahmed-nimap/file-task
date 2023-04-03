const xlsx = require('xlsx');
const fs = require('fs');
const {excelToJson, finToJson} = require('./convertToJson');

function convert () {
    let files = fs.readdirSync('./exceldata');
    files = files.filter((each) => !each.startsWith('~'));
    files.forEach((each) => {
        let fileName = each.split('.')[0];
        let reverseFileName = '';
        for (let i = fileName.length - 1; i >= 0; i--) {
            if (i % 2 != 0) {
                reverseFileName += fileName[i-1] + fileName[i]
            }
        }
        let finFolder = fs.readdirSync('./extracted');
        finFolder = finFolder.find((each) => each.includes(reverseFileName));
        let finFiles = fs.readdirSync(`./extracted/${finFolder}`);
        let finFile = finFiles.find((each) => each.includes('DataKeyValues') && each.includes(finFolder));
        compare(`./exceldata/${each}`, `./extracted/${finFolder}/${finFile}`, fileName, reverseFileName);
    })
}

function compare (excelFilePath, csvFilePath, excelfileName, csvFileName) {
    let result = [];
    let csv = finToJson(csvFilePath);
    let excel = excelToJson(excelFilePath);
    // console.log(csv.slice(0, 10))
    console.log(excel.slice(0, 5));
    console.log(csv[3]['Amount'] ,(typeof excel[0]['Amount'] == 'string' ? excel[0]['Amount'].replace(/\$/, '').replace(/,/, '') : excel[0]['Amount']));
    for (let i = 0; i < csv.length; i++) {
        if (!csv[i] || csv[i]['Amount'] == 0) {
            continue;
        }
        else {
            for (let j = 0; j < excel.length; j++) {
                let jsonAmount = typeof excel[j]['Amount'] == 'string' ? Number((excel[j]['Amount']).replace(/\$/, '').replace(/,/, '')) : excel[j]['Amount'];
                if (csv[i]['Amount'] == (jsonAmount) || csv[i]['Amount'] == -(jsonAmount) || csv[i]['Amount'] == excel[j]['Qty'] || csv[i]['Amount'] == excel[j]['%']) {
                    let resultObj = {
                        xlDataKey: excel[j]['DataKey'],
                        xlAmount: excel[j]['Amount'],
                        csvDataKey: csv[i]['DataKey'],
                        csvAmount: csv[i]['Amount'],
                        Qty: excel[j]['Qty'] || excel[j]['Qty'] != '' ? excel[j]['Qty'] : null,
                        drillDownDesc: csv[i]['DrillDownDesc'] || csv[i]['DrillDownDesc'] != '' ? csv[i]['DrillDownDesc'] : null,
                        type: csv[i]['Amount'] == jsonAmount ? 'Amount' : csv[i]['Amount'] == excel[j]['Qty'] ? 'Qty' : 'PER'
                    };
                    result.push(resultObj);
                }// else if () {
                //     let resultObj = {
                //         xlDataKey: excel[j]['DataKey'],
                //         xlAmount: excel[j]['Amount'],
                //         csvDataKey: csv[i]['DataKey'],
                //         csvAmount: csv[i]['Amount'],
                //         Qty: excel[j]['Qty'],
                //         drillDownDesc: csv[i]['DrillDownDesc']
                //     };
                //     console.log()
                // }
            }
        }
    };
    fs.writeFileSync(`./json/${excelfileName}.json`, JSON.stringify(result))
};

compare('./Sample.xlsx', './tblDataKeyValues2303091100510.csv')

convert();


// const folders = fs.readdirSync('./json');
// let result = [];
// folders.forEach((file) => {
//     const content = JSON.parse(fs.readFileSync(`./json/${file}`, 'utf-8'));
//     for (let each of content) {
//         const {xlDataKey, xlAmount, csvDataKey} = each;
//         if (each.xlDataKey.startsWith('-') || each.xlDataKey.startsWith('+')) {
//             each.xlDataKey = each.xlDataKey.slice(2);
//         }
//         if (each.xlDataKey && each.csvDataKey.includes(each.xlDataKey.split(" ").join('_').toUpperCase())) {
//             if (each.xlDataKey.slice(-3) === 'CNT') {
//                 console.log(each)
//             }
//         }
//     }
// });

// let result = [];

// const content = JSON.parse(fs.readFileSync('./json/040323.json', 'utf-8'));
// for (let each of content) {
//     let obj = {};
//     if (each.drillDownDesc) {
//         obj['DataKey'] = each['xlDataKey'];
//         if (each.type == 'Amount') {
//             obj['Amount'] == each['csvAmount'];
//         } 
//         if (each.type == 'Qty') {
//             obj['Qty'] = each['Qty']
//         }
//         result.push(obj);
//     };
// };

// console.log(result);

// let xlResult = xlsx.utils.json_to_sheet(JSON.stringify(result));
// console.log(xlResult);
