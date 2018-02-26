const csv = require('csvtojson');
const moment = require('moment');
moment().format();
const tableGenerator = require('./table-generator');

const csvData = `Publication Date,Title,Authors
29/07/1954,Lord of the Rings,John Ronald Reuel Tolkien
01/08/1996,A Game of Thrones,George Raymond Martin
21/06/2003,Harry Potter and the Order of the Phoenix,Joanne Rowling`;

const tableSettings = [
    {
        titleOverride: 'Pub Date',
        width: 11,
        preProcessFunction: (dateString) =>
            moment(dateString, 'DD/MM/YYYY').format('DD MMM YYYY')
    },
    {
        width: 29
    },
    {
        width: 21
    }
];

tableGenerator(tableSettings)
    .tableStringPromiseFromCSVConverter(
        csv()
            .fromString(csvData)
    )
    .then(console.log)
    .catch((err) => console.log(`Error parsing CSV: ${err.message}`));