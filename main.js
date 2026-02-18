// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import * as gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/gsap.min.js';
// import * as Chart from 'https://cdn.jsdelivr.net/npm/chart.js'
/*

class Account {

    constructor(name, currentMoney, interest = 0, date) {
        this.name = name;
        this.currentMoney = currentMoney;
        this.interest = interest;
        this.date = date;
    }

    loadTransactionsFromLocalStorage() {
        const transactions = JSON.parse(localStorage.getItem(this.name));
        if (transactions)
            return transactions;
        return [];
    }

    loadToLocalStorage(data = {}) {
        const transactions = loadTransactionsFromLocalStorage() || [];
        transactions.push(data);
        localStorage.setItem(this.name, JSON.stringify(transactions));
    }

    getTransactions() {
        const transactions = JSON.parse(localStorage.getItem(this.name));
        if (transactions) {
            return transactions;
        }
        return [];
    }

    updateBalance() {

    }
}
*/

import { validInputs, formateDate, clearInputs } from './helpers.js';

// ***********
// Modals
// ***********


const Storage = {
    get(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },

    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
};


class Account {
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

class Transaction {
    constructor(id, type, amount, category, date) {
        this.id = id;
        this.type = type.toLowerCase();
        this.amount = amount;
        this.category = category;
        this.date = date;
    }
    toHTML() {
        return `
            <tr id=${this.id}>
                <td class="sm:p-3 type p-3">${this.type}</td>
                <td class="sm:p-3 p-3 text-[var(--${this.type})]">${this.type === 'expense' ? '-' : '+'} ${this.amount} EGP</td>
                <td class="sm:p-3 p-3">${this.category}</td>
                <td class="sm:p-3 p-3">${this.date}</td>
                <td>
                    <button class='edit-btn'>📝</button>
                </td>
                <td>
                    <button class='delete-btn'>❌</button>
                </td>
            </tr>
        `;
    }
}



function renderAccountInfo(account) {
    const balance = document.getElementById('total');
    const income = document.getElementById('income');
    const expenses = document.getElementById('expenses');
    balance.innerText = account.getBalance();
    income.innerText = account.getTotalIncome();
    expenses.innerText = account.getTotalExpenses();
}

function renderTransactions(transactionsTable, transactions) {
    transactionsTable.innerHTML = '';
    transactions.forEach(transaction => {
        const t = new Transaction(
            transaction.id,
            transaction.type,
            transaction.amount,
            transaction.category,
            transaction.date,
        );
        transactionsTable.insertAdjacentHTML('beforeend', t.toHTML());
    });
}


function is_empty_transactions(transactionsTable, account) {

    renderAccountInfo(account);
    if (account.getTransactions().length === 0) {
        document.getElementById('empty-transactions-warning').classList.remove('hidden');
        document.querySelector('section.transactions').classList.add('hidden');
        return;
    }

    document.getElementById('empty-transactions-warning').classList.add('hidden');
    document.querySelector('section.transactions').classList.remove('hidden');
    renderTransactions(transactionsTable, account.getTransactions());
}


// ***********
// Main
// ***********

function main() {

    const page = 'home';
    const account = new Account(page);

    const transactionsTable = document.querySelector('tbody#transactions');

    const modal = document.getElementById("transaction-modal");
    const form = document.getElementById("transaction-form");
    const openBtn = document.getElementById('add-transaction-btn');
    const closeBtn = document.getElementById('close-modal');

    const typeSelect = form.querySelector('#transaction-type');
    const inputs = [typeSelect, ...form.querySelectorAll('input')];


    is_empty_transactions(transactionsTable, account);


    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validInputs(inputs)) return;

        const tx = new Transaction(
            Number(new Date()),
            inputs[0].value,
            Number(inputs[1].value),
            inputs[2].value.trim(),
            formateDate(inputs[3].value)
        );

        account.addTransaction(tx);
        modal.classList.add('hidden');
        clearInputs(inputs);
        renderAccountInfo(account)
        renderTransactions(transactionsTable, account.getTransactions())
    });


    window.addEventListener('storage', (e) => {
        if (e.key === account.name) {
            renderAccountInfo(account);
            renderTransactions(transactionsTable, account.getTransactions());
        }
    });

    // Buttons
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));

    transactionsTable.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (!row) return;

        if (e.target.classList.contains('delete-btn')) {
            account.deleteTransaction(row.id);
            renderAccountInfo(account);
            renderTransactions(transactionsTable, account.getTransactions());
        }

        if (e.target.classList.contains('edit-btn')) {
            modal.classList.remove('hidden');
            // load row data into form here
        }
    });
}

document.addEventListener('DOMContentLoaded', main);


const accountOpenBtn = document.getElementById('add-account-btn');
const accountModal = document.getElementById('account-modal');
const accountCloseBtn = document.getElementById('close-account-modal');
const createAccountBtn = document.getElementById('create-account-btn');

if (accountOpenBtn && accountModal) {
    accountOpenBtn.addEventListener('click', () => accountModal.classList.remove('hidden'));
}
if (accountCloseBtn) {
    accountCloseBtn.addEventListener('click', () => accountModal.classList.add('hidden'));
}
if (createAccountBtn) {
    createAccountBtn.addEventListener('click', () => accountModal.classList.add('hidden'));
}