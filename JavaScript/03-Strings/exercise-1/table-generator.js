class TableStringGenerator {
    constructor(parameters) {
        this.userSettings = parameters;
        this.columns = []
    }

    truncateWithEllipsis(string, fitToLength) {
        if (string.length > fitToLength) {
            string = string.substr(0, fitToLength - 3) + '...';
        }
        return string;
    }

    padWithSpaces(string, targetLength) {
        return string.padStart(targetLength, " ");
    }

    formatTableFieldEntry(string, length) {
        return this.padWithSpaces(this.truncateWithEllipsis(string, length), length);
    }

    joinRowValuesWithPipes(rowValues) {
        return this.rowValuesToTableStringRow(rowValues, ' ', '|', '|');
    }

    rowValuesToTableStringRow(rowValues, padding = ' ', ends = '|', midSplit = '|') {
        return ends
            + padding
            + rowValues.join(padding + midSplit + padding)
            + padding
            + ends;
    }

    setUpFromHeader(headerArray) {
        let headerOutputValues = [];
        headerArray.forEach((headerName, headerIndex) => {
            const userSettingsForColumn =
                Object.assign(
                    {},
                    this.userSettings[headerIndex]
                );

            const columnSettings = {
                name: headerName
            };

            columnSettings.outputName =
                userSettingsForColumn['titleOverride']
                    ? userSettingsForColumn['titleOverride']
                    : headerName;

            columnSettings.width =
                userSettingsForColumn.width
                    ? userSettingsForColumn.width
                    : columnSettings.outputName.length;

            columnSettings.preProcessFunction =
                userSettingsForColumn.preProcessFunction
                    ? userSettingsForColumn.preProcessFunction
                    : (string) => string;

            this.columns.push(columnSettings);

            headerOutputValues.push(
                this.formatTableFieldEntry(
                    columnSettings.outputName,
                    columnSettings.width
                )
            );
        });
        return this.joinRowValuesWithPipes(headerOutputValues);
    }

    rowToTableStringRow(row) {
        return this.joinRowValuesWithPipes(
            this.columns.map((columnSettings) => {
                const columnValue = row[columnSettings.name] ? columnSettings.preProcessFunction(row[columnSettings.name]) : '';
                return this.formatTableFieldEntry(columnValue, columnSettings.width);
            })
        );
    }

    tableStringHeaderSplitRow() {
        const splitLineCharacter = '=';
        return this.rowValuesToTableStringRow(
            this.columns.map((column) => splitLineCharacter.repeat(column.width)),
            splitLineCharacter,
            '|',
            splitLineCharacter
        )
    }

    tableStringPromiseFromCSVConverter(csvConverter) {
        return new Promise((resolve, reject) => {
            const tableStringRows = [];
            csvConverter
                .on('error', (err) => reject(err))
                .on('header', (header) => {
                    tableStringRows.push(this.setUpFromHeader(header));
                    tableStringRows.push(this.tableStringHeaderSplitRow());
                })
                .on('json', (row) => {
                    tableStringRows.push(this.rowToTableStringRow(row));
                })
                .on('end', () => {
                    resolve(tableStringRows.join("\n"));
                });
        });
    }
}

module.exports = function() {
    return new TableStringGenerator(...arguments);
};
