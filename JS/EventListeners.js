import { loadModal } from "./utility.js";

const modals = document.getElementById('modals');

// Transaction Modal

const openModal = document.getElementById('add-transaction-btn');
const addTransactionBtn = document.getElementById('add-btn');

openModal.addEventListener('click', async () => {
    modals.innerHTML = '';
    modals.innerHTML += await loadModal('addTransaction');

    const closeModalBtn = document.getElementById('close-modal');
    closeModalBtn.addEventListener('click', () => modals.innerHTML = '');

    // addTransactionBtn.addEventListener('click', () => kc)
});
