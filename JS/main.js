import { Storage, formateDate, clearInputs } from "./utility.js";
/*
const accounts = {
    'home': {
        balance,
        accountType,
        transactions: [
            {
                id,
                transactionType,
                amount,
                date
            },
            {
                id,
                transactionType,
                amount,
                date
            },
        ]
    },
    'Mahsreq': {

    }
}
*/

// function loadAccounts() {
//     const accounts = Storage.get('accounts');

//     if (accounts.length !== 0) {
//         const currentAccount = new Account('Home'); 
//         setupHTML(accounts['home']);
//     }
// }


// function setupHTML(account) {

// }



class Account {
    constructor(name) {
        this.name = name;
        this.transactions = this.uploadTransactions();
    }

    setAccountType(accountType) {
        this.accountType = accountType;
    }

    getAccountType() {
        return this.accountType ? this.accountType : 'current';
    }

    uploadTransactions() {
        const transactions = Storage.get(this.name);
        if (!transactions) {
            Storage.set(this.name, []);
            return Storage.get(this.name);
        } else return transactions;
    }

    getBalance() {
        return this.transactions.reduce((total, tx) => {
            if (tx.transactionType.toLowerCase() === 'income')
                return total + Number(tx.amount);
            else return total - Number(tx.amount);
        }, 0) || 0;
    }

    getTotalExpenses() {
        return this.transactions.reduce((total, curr) => {
            if (curr.transactionType.toLowerCase() === 'expense')
                return total + Number(curr.amount ?? 0)
        }, 0) || 0;
    }

    getTotalIncome() {
        return this.transactions.reduce((total, curr) => {
            if (curr.transactionType.toLowerCase() === 'income')
                return total + Number(curr.amount ?? 0);
        }, 0) || 0;
    }

    addTransaction({ amount, transactionType, category, date = '', notes = 'No Notes' }) {
        this.transactions.push({
            'id': Math.random() * 1000,
            'transactionType': transactionType,
            'amount': amount,
            'category': category,
            'date': formateDate(date),
            'notes': notes
        });
    }

    saveTransactions() {
        Storage.set(this.name, this.transactions);
    }

    removeTransaction(id) {
        this.transactions = this.transactions.filter(tx => tx.id != id);
    }
}

const transactionsBody = document.getElementById("transactions");

const modals = document.getElementById('modals');
let name = 'Home';
const homeAccount = new Account(name);
const emptyTransactionsWarning = document.getElementById('empty-transactions-warning');

async function uploadComponent(componentName) {
    try {
        const res = await fetch('./Components/' + componentName + '.html');
        const data = await res.text();
        return data;
    } catch (e) {
        console.log(e);
    }
}


function fillData() {
    document.getElementById('total-income').innerText = homeAccount.getTotalIncome();
    document.getElementById('total-expense').innerText = homeAccount.getTotalExpenses();
    document.getElementById('total').innerText = homeAccount.getBalance();

    transactionsBody.innerHTML = '';
    const transactions = homeAccount.uploadTransactions();
    transactions.forEach(tx => {
        transactionsBody.innerHTML += `
            <tr id='${tx.id}'>
                <td>${tx.transactionType}</td>
                <td>${tx.amount}</td>
                <td>${tx.category}</td>
                <td>${tx.date}</td>
                <td class='notes'>${tx.notes}</td>
                <td class='close'>❌</td>
            </tr>
        `;
    })
}
fillData()

transactionsBody.addEventListener('click', e => {
    if (e.target.classList.contains('close')) {
        const id = e.target.closest('tr').id;
        homeAccount.removeTransaction(id);
        homeAccount.saveTransactions();
        fillData()
    }
})


document.getElementById('add_transaction_btn').addEventListener('click', async () => {
    modals.innerHTML = await uploadComponent('add_transaction');

    const form = modals.querySelector('form');
    const closeBtn = modals.querySelector('#close_btn');

    closeBtn?.addEventListener('click', (e) => {
        clearInputs(document.querySelectorAll('#modals .input'));
        e.target.closest('.modal').innerHTML = '';
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const transactionType = document.getElementById('transaction-type').value;
        const amount = document.getElementById('amount').value.trim();
        const category = document.getElementById('category').value.trim();
        const date = document.getElementById('date').value.trim();
        const notes = document.getElementById('notes').value.trim();

        if (!amount || !category) {
            alert("Please fill in required fields.");
            return;
        }

        homeAccount.addTransaction({ amount, transactionType, category, date, notes });
        homeAccount.saveTransactions();
        fillData();
    });
});