const Account = require('./accounts');

module.exports = class {
        constructor(date, from, to, description, amount) {
            this.date = date;
            this.from = from;
            this.to = to;
            this.description = description;
            this.amount = amount;
        }

        /*
        Returns true if this payment was sent by the specified account
         */
        isFrom(account) {
            if (account instanceof Account) {
                return (this.from === account);
            } else {
                throw 'argument must be of type Account';
            }
        }

        /*
        Returns true if this payment was received by the specified account
         */
        isTo(account) {
            if (account instanceof Account) {
                return (this.to === account);
            } else {
                throw 'argument must be of type Account';
            }
        }

        /*
        Returns a nice string detailing the transaction
         */
        toString() {
            return this.date.format("YYYY-MM-DD") + ': FROM ' + this.from.name + ' TO ' + this.to.name + ': £' + formatAmountString(this.amount) + ' FOR ' + this.description;
        }
    }