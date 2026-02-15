// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import * as gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/gsap.min.js';
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
    constructor(type, amount, category, date) {
        this.type = type.toLowerCase();
        this.amount = amount;
        this.category = category;
        this.date = date;
    }
    toHTML() {
        return `
            <tr>
                <td class="sm:p-3 type p-3">${this.type}</td>
                <td class="sm:p-3 p-3 text-[var(--${this.type})]">${this.type === 'expense' ? '-' : '+'} ${this.amount} EGP</td>
                <td class="sm:p-3 p-3">${this.category}</td>
                <td class="sm:p-3 p-3">${this.date}</td>
            </tr>
        `;
    }
}




// ******************
// Helper Functions
// ******************

function validInputs(inputs) {
    let isSomeEmpty = inputs.some(input => input.value === '' && input.type != 'date');
    let amount = inputs[1].value;
    if (isSomeEmpty || amount <= 0)
        return false;
    return true;
}

function formateDate(date = '') {
    let formatedDate = date === '' ? new Date() : new Date(date);
    return formatedDate
        .toString().split(" ")
        .slice(0, 4)
        .join(" ");
}


function getPageName() {
    return window.location.href.match(/\w+.html/g)[0].replace('.html', '');
}

function renderAccountInfo(account) {
    const balance = document.getElementById('total');
    const income = document.getElementById('income');
    const expenses = document.getElementById('expenses');
    balance.innerText = account.getBalance() || 0;
    income.innerText = account.getTotalIncome() || 0;
    expenses.innerText = account.getTotalExpenses() || 0;
}

function renderTransactions(transactionsTable, transactions) {
    transactionsTable.innerHTML = '';
    transactions.forEach(transaction => {
        const t = new Transaction(
            transaction.type,
            transaction.amount,
            transaction.category,
            transaction.date,
        );
        transactionsTable.insertAdjacentHTML('beforeend', t.toHTML());
    });
}

function clearInputs(inputs) {
    inputs.forEach(input => input.value = '');
}

// ***********
// Main
// ***********

function main() {

    const page = getPageName() === 'index' ? 'home' : getPageName();
    const account = new Account(page);

    const transactionsSection = document.querySelector('section.transactions');
    const transactionsTable = document.querySelector('tbody#transactions');

    const modal = document.getElementById("transaction-modal");
    const form = document.getElementById("transaction-form");
    const openBtn = document.getElementById('add-transaction-btn');
    const closeBtn = document.getElementById('close-modal');

    const typeSelect = form.querySelector('#transaction-type');
    const inputs = [typeSelect, ...form.querySelectorAll('input')];

    renderAccountInfo(account);
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validInputs(inputs)) return;

        const tx = new Transaction(
            inputs[0].value,
            Number(inputs[1].value),
            inputs[2].value.trim(),
            formateDate(inputs[3].value)
        );

        account.addTransaction(tx);
        renderTransactions(transactionsTable, account.getTransactions());
        modal.classList.add('hidden');
        clearInputs(inputs);
    });

    if (account.getTransactions().length === 0) {
        document.getElementById('empty-transactions-warning').classList.remove('hidden');
        transactionsSection.classList.add('hidden');
        return;
    }

    document.getElementById('empty-transactions-warning').classList.add('hidden');
    transactionsSection.classList.remove('hidden');

    renderTransactions(transactionsTable, account.getTransactions());
}

main()

// document.addEventListener('DOMContentLoaded', main);