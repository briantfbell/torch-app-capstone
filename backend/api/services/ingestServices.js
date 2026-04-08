const readExcelFile = require('read-excel-file/node')
const db = require('../../db/knex');

exports.postIngestItem = async file => {
  readExcelFile(file.buffer).then((rows) => {
    // 'rows' is an array of arrays representing the spreadsheet
    console.log(rows);
    return rows;
  });
};
