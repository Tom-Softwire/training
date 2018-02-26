const Transaction = require('./transactions');

module.exports = class {
        constructor(name) {
            this.name = name;
            this.balance = 0;
            this.transactions = [];
        }

        /*
        Associates the specified transaction to this account
         */
        addTransaction(transaction, isPayee) {
            if (transaction instanceof Transaction) {
                this.transactions.push(transaction);
                if(isPayee) {
                    this.balance += transaction.amount;
                } else {
                    this.balance -= transaction.amount;
                }
                return true;
            } else {
                return false;
            }
        }

        /*
        Calls logFunction with a nice description for each transaction associated with this account
         */
        logAllTransactions(logFunction) {
            for(let i = 0; i < this.transactions.length; i++) {
                logFunction(this.transactions[i].toString());
            }
        }
    }