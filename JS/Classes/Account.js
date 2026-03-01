import { Storage, is_empty_transactions } from "../utility.js";


export class Account {
    constructor(name) {
        this.name = name;
    }

    getTransactions() {
        return Storage.get(this.name);
    }

    addTransaction(tx) {
        const list = this.getTransactions();
        list.push(tx);
        Storage.set(this.name, list);
    }

    deleteTransaction(id) {
        let currentTransactions = this.getTransactions().filter(tx => tx.id != id);
        Storage.set(this.name, currentTransactions);
        is_empty_transactions(this);
    }

    editTransaction(id, newData) {
        const editedTx = this.getTransactions().find(transaction => transaction.id == id);

    }

    getBalance() {
        return this.getTransactions().reduce((sum, t) => {
            return t.type === 'income'
                ? sum + t.amount
                : sum - t.amount;
        }, 0);
    }

    getTotalIncome() {

        return this.getTransactions().reduce((sum, transaction) => {
            return transaction.type === 'income' ?
                sum + transaction.amount : sum;
        }, 0);
    }

    getTotalExpenses() {
        return this.getTransactions().reduce((sum, transaction) => {
            return transaction.type === 'expense' ?
                sum + transaction.amount : sum;
        }, 0);
    }
}