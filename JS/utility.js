import { Transaction } from './Classes/Transaction.js';


export function validInputs(inputs) {
    let isEmpty = inputs.some(input => input.value === '' && input.type !== 'date');
    let isAmountBalanced = inputs.some(input => (input.type === 'number' && Number(input.value) > 0));
    return (!isEmpty && isAmountBalanced);
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
