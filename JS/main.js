// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import * as gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/gsap.min.js';
// import * as Chart from 'https://cdn.jsdelivr.net/npm/chart.js'

import { validInputs, formateDate, clearInputs, renderAccountInfo, renderTransactions, is_empty_transactions } from './utility.js';
import { Account } from './Classes/Account.js';
import { Transaction } from './Classes/Transaction.js';

function main() {
    const account = new Account('home');

    const transactionsTable = document.querySelector('tbody#transactions');


    // const typeSelect = form.querySelector('#transaction-type');
    // const inputs = [typeSelect, ...form.querySelectorAll('input')];

    is_empty_transactions(account);
    // form.addEventListener('submit', (e) => {
    //     e.preventDefault();

    //     if (!validInputs(inputs)) return;

    //     const tx = new Transaction(
    //         Number(new Date()),
    //         inputs[0].value,
    //         Number(inputs[1].value),
    //         inputs[2].value.trim(),
    //         formateDate(inputs[3].value)
    //     );

    //     account.addTransaction(tx);
    //     modal.classList.add('hidden');
    //     is_empty_transactions(account);
    //     clearInputs(inputs);
    // });


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

