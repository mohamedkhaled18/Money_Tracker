import { Transaction } from './Classes/Transaction.js';


export function validInputs(inputs) {
    let isSomeEmpty = inputs.some(input => input.value === '' && input.type != 'date');
    let amount = inputs[1].value;
    if (isSomeEmpty || amount <= 0)
        return false;
    return true;
}

export function formateDate(date = '') {
    let formatedDate = date === '' ? new Date() : new Date(date);
    return formatedDate
        .toString().split(" ")
        .slice(0, 4)
        .join(" ");
}

export function clearInputs(inputs) {
    inputs.forEach(input => input.value = '');
}

export const Storage = {
    get(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },

    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
};

export function is_empty_transactions(account) {

    renderAccountInfo(account);
    if (account.getTransactions().length === 0) {
        document.getElementById('empty-transactions-warning').classList.remove('hidden');
        document.querySelector('section.transactions').classList.add('hidden');
        return;
    }

    document.getElementById('empty-transactions-warning').classList.add('hidden');
    document.querySelector('section.transactions').classList.remove('hidden');
    renderTransactions(document.querySelector('tbody#transactions'),account.getTransactions());
}

export async function loadModal(componentName) {
    try {    
        const response = await fetch(`./Components/${componentName}.html`);
        const modalHTML = await response.text();
        return modalHTML;
    }catch(e){
        console.log(e);
    }
}

export function renderAccountInfo(account) {
    const balance = document.getElementById('total');
    const income = document.getElementById('income');
    const expenses = document.getElementById('expenses');
    balance.innerText = account.getBalance();
    income.innerText = account.getTotalIncome();
    expenses.innerText = account.getTotalExpenses();
}

export function renderTransactions(transactionsTable,transactions) {
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