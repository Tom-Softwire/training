const assert = require('assert');
const csv = require('csvtojson');
const moment = require('moment');
moment().format();
const tableGenerator = require('../table-generator');

describe('TableStringGenerator', function() {
    describe('#tableStringPromiseFromCSVConverter()', function() {
        it('should generate a table in the correct format', function() {
            // arrange
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

            // act
            const promiseOfTableString = tableGenerator(tableSettings)
                .tableStringPromiseFromCSVConverter(
                    csv()
                        .fromString(csvData)
                );

            // assert
            return promiseOfTableString
                .then((tableString) => {
                    assert.equal(tableString, `|    Pub Date |                         Title |               Authors |
|=====================================================================|
| 29 Jul 1954 |             Lord of the Rings | John Ronald Reuel ... |
| 01 Aug 1996 |             A Game of Thrones | George Raymond Martin |
| 21 Jun 2003 | Harry Potter and the Order... |        Joanne Rowling |`);
                });
        });
    });
});
