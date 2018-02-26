const readlineSync = require('readline-sync');
const moment = require('moment');
require('moment-msdate');
moment().format();
const fs = require('fs');
const log4js = require('log4js');
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});
const logger = log4js.getLogger('file');
const xmlParser = require('xml2js-parser');
const SupportBank = require('./support-bank');

/*
Puts a value into a nice format for displaying
 */
function formatAmountString(amount, useAbsoluteValue) {
    let string = useAbsoluteValue ? Math.abs(amount) : amount;
    return Number(Math.round(string+'e2')+'e-2').toFixed(2);
}

logger.info('Program initiated.');

let bank;
function resetBank() {
    bank = new SupportBank();
}
resetBank();

console.log('Welcome to SupportBank');
console.log('Use \'Import Data\' to load a data file.');
console.log('Enter \'Help\' for a list of supported commands.');
while (true) {
    let command = readlineSync.question('Command: ');
    let commandLowercase = command.toLowerCase();

    if (commandLowercase === 'list all') {
        bank.logAllAccounts(console.log);


    } else if (commandLowercase.substring(0, 5) === 'list ') {
        let accountName = command.substring(5);
        let account = bank.getAccountByName(accountName, false);
        if (account === undefined) {
            console.log('No account exists with the name \'' + accountName + '\'.');
        } else {
            account.logAllTransactions(console.log);
        }


    }  else if (commandLowercase.substring(0, 12) === 'import data ') {
        let fileName = command.substring(12);
        if(bank.hasLoadedAnyDataFiles()) {
            let resetQuestion = 'Remove previously imported data before continuing?';
            if(bank.hasLoadedDataFile(fileName)) {
                resetQuestion = 'This data file has already been imported. Remove previously imported data before continuing?';
            }
            let response = readlineSync.question(resetQuestion + ' (y/n):', {limit: ['y', 'n']});
            if(response.toLowerCase() === 'y') {
                resetBank();
            }
        }
        if (bank.loadDataFile(fileName)) {
            if(bank.lastDataLoadErrorCount === 0) {
                console.log('Data imported successfully.');
                logger.info('File import successful.');
            } else {
                console.log('Data imported. ' + bank.lastDataLoadErrorCount + ' errors found. Data may be incomplete. See debug.log for details.');
                logger.info('File import successful with some errors.');
            }
        } else {
            console.log('Data load failed: ' + bank.lastDataLoadFailureMessage);
            logger.info('File import failed.');
        }


    }  else if (commandLowercase.substring(0, 12) === 'export data ') {
        let fileName = command.substring(12);
        if (bank.exportToFile(fileName)) {
            console.log('Data exported successfully.');
            logger.info('File export successful.');
        } else {
            console.log('Data export failed: ' + bank.lastDataExportFailureMessage);
            logger.info('File export failed.');
        }


    } else if (commandLowercase === 'reset') {
        resetBank();
        console.log('Imported data reset.');


    } else if (commandLowercase === 'help') {
        console.log('List All: prints a list of all accounts with the amount of money they owe or are owed.');
        console.log('List [account name]: prints a list of all transactions involving [account name].');
        console.log('Import Data [file name]: attempts to load the data from the specified file.');
        console.log('Reset: resets all loaded data.');
        console.log('Quit: exits the program.');


    } else if (commandLowercase === 'quit') {
        break;


    } else {
        console.log('Command not recognised.');


    }
}