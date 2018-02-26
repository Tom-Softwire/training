const Account = require('./accounts');
const Transaction = require('./transactions');

module.exports = class {
        constructor() {
            this.accounts = [];
            this.lastAddTransactionError = '';
            this.lastDataLoadFailureMessage = '';
            this.lastDataLoadErrorCount = 0;
            this.loadedDataFiles = [];
            this.lastDataExportFailureMessage = '';
        }

        /*
        Returns true if any data files have been loaded into this bank (even if they contained no data)
         */
        hasLoadedAnyDataFiles() {
            return this.loadedDataFiles.length > 0;
        }

        /*
        Returns true if the file with the given name has been loaded into this bank
         */
        hasLoadedDataFile(fileName) {
            return this.loadedDataFiles.indexOf(fileName) >= 0;
        }

        /*
        Returns the Account with the specified name associated with this bank
        Set commit=false to check only
         */
        getAccountByName(name, commit=true) {
            for (let i = 0; i < this.accounts.length; i++) {
                let account = this.accounts[i];
                if (account.name === name) {
                    return account;
                }
            }
            if (commit) {
                let newAccount = new Account(name);
                this.accounts.push(newAccount);
                return newAccount;
            } else {
                return undefined;
            }
        }

        /*
        Adds a transactions with the specified details into this bank
         */
        addTransaction(transactionMoment, fromName, toName, description, amountString) {
            if(transactionMoment.isValid()) {
                let amount = parseFloat(amountString);
                if(!isNaN(amount)) {
                    let fromAccount = this.getAccountByName(fromName);
                    let toAccount = this.getAccountByName(toName);
                    let transaction = new Transaction(transactionMoment, fromAccount, toAccount, description, amount);
                    if(!fromAccount.addTransaction(transaction, false)) return false;
                    if(!toAccount.addTransaction(transaction, true)) return false;
                    return true;
                } else {
                    this.lastAddTransactionError = 'Invalid amount.';
                    return false;
                }
            } else {
                this.lastAddTransactionError = 'Invalid date.';
                return false;
            }
        }

        /*
        Calls logFunction with a nice description for each account in this bank
         */
        logAllAccounts(logFunction) {
            if(!this.hasLoadedAnyDataFiles()) {
                logFunction('No data loaded.');
                return false;
            }
            for(let i = 0; i < this.accounts.length; i++) {
                let account = this.accounts[i];

                let output = account.name + ' ';
                output += (account.balance < 0 ? 'OWES' : 'IS OWED');
                output += ': £' + formatAmountString(account.balance, true);

                logFunction(output);
            }
            return true;
        }

        /*
        Adds all transactions from the CSV data string into this bank
         */
        loadCSVData(CSVData) {
            let transactionStrings = CSVData.split('\n');
            for(let i = 1; i < transactionStrings.length; i++) { // skip first row since it is header
                let lineNumber = i + 1;
                let transactionString = transactionStrings[i];
                let transactionDetails = transactionString.split(',');
                if(transactionDetails.length === 5) {
                    if(!this.addTransaction(moment(transactionDetails[0], 'DD/MM/YYYY', true), transactionDetails[1], transactionDetails[2], transactionDetails[3], transactionDetails[4])) {
                        logger.warn('Could not process transaction on line ' + lineNumber + ': ' + this.lastAddTransactionError);
                        this.lastDataLoadErrorCount++;
                    }
                } else if(transactionString.length > 0) {
                    logger.warn('Could not process transaction on line ' + lineNumber + ': Not enough fields provided.');
                    this.lastDataLoadErrorCount++;
                }
            }
            return true;
        }

        /*
        Adds all transactions from the JSON data string into this bank
         */
        loadJSONData(JSONData) {
            let transactionsDetails;
            try {
                transactionsDetails = JSON.parse(JSONData);
            } catch(err) {
                logger.warn('Invalid syntax.');
                this.lastDataLoadErrorCount++;
                return false;
            }
            for(let i = 0; i < transactionsDetails.length; i++) {
                let objectNumber = i + 1;
                let transactionDetails = transactionsDetails[i];
                if(!this.addTransaction(moment(transactionDetails.Date), transactionDetails.FromAccount, transactionDetails.ToAccount, transactionDetails.Narrative, transactionDetails.Amount)) {
                    logger.warn('Could not process transaction number ' + objectNumber + ': ' + this.lastAddTransactionError);
                    this.lastDataLoadErrorCount++;
                }
            }
            return true;
        }

        /*
        Adds all transactions from the XML data string into this bank
         */
        loadXMLData(XMLData) {
            let transactionsDetails;
            try {
                transactionsDetails = xmlParser.parseStringSync(XMLData).TransactionList.SupportTransaction;
            } catch(err) {
                logger.warn('Invalid syntax.');
                this.lastDataLoadErrorCount++;
                return false;
            }

            for(let i = 0; i < transactionsDetails.length; i++) {
                let objectNumber = i + 1;
                let transactionDetails = transactionsDetails[i];

                if(!this.addTransaction(moment.fromOADate(transactionDetails.$.Date), transactionDetails.Parties[0].From[0], transactionDetails.Parties[0].To[0], transactionDetails.Description, transactionDetails.Value)) {
                    logger.warn('Could not process transaction number ' + objectNumber + ': ' + this.lastAddTransactionError);
                    this.lastDataLoadErrorCount++;
                }
            }

            return true;
        }

        /*
        Adds all transactions from the specified file, if not done so already, into this bank
         */
        loadDataFile(fileName) {
            logger.info('Attempting to load ' + fileName);

            if(this.hasLoadedDataFile(fileName)) {
                logger.warn('File already loaded.');
                this.lastDataLoadFailureMessage = 'Data file already imported.';
                return false;
            }

            let fileContent;
            try {
                fileContent = fs.readFileSync(fileName, {encoding: 'UTF-8'});
            } catch(err) {
                logger.warn('File read error: ' + err);
                this.lastDataLoadFailureMessage = 'File not found or could not be read.';
                return false;
            }

            let fileExtension = fileName.split('.').pop();
            switch(fileExtension) {
                case 'csv':
                    this.loadCSVData(fileContent);
                    break;
                case 'json':
                    this.loadJSONData(fileContent);
                    break;
                case 'xml':
                    this.loadXMLData(fileContent);
                    break;
                default:
                    logger.warn('Unsupported file extension.');
                    this.lastDataLoadFailureMessage = 'Unsupported file extension.';
                    return false;
                    break;
            }
            this.loadedDataFiles.push(fileName);
            return true;
        }

        /*
        Returns the content of this bank as a JSON data string
         */
        buildJSONData() {
            // TODO: build the data!
            return '';
        }

        /*
        Exports all data from this bank into the specified file
         */
        exportToFile(fileName) {
            logger.info('Attempting to export to ' + fileName);

            this.lastDataExportFailureMessage = '';

            let fileContent;

            let fileExtension = fileName.split('.').pop();
            switch(fileExtension) {
                case 'json':
                    fileContent = this.buildJSONData();
                    break;
                default:
                    logger.warn('Unsupported file extension.');
                    this.lastDataExportFailureMessage = 'Unsupported file extension.';
                    return false;
                    break;
            }

            try {
                // TODO: write file with fileContent
            } catch(err) {
                logger.warn('File write error: ' + err);
                this.lastDataExportFailureMessage = 'File not found or could not be written to.';
                return false;
            }

            return true;
        }
    }