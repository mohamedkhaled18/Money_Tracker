export class Transaction {
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
            <td class="type p-3">${this.type}</td>
            <td class="p-3 text-[var(--${this.type})]">${this.type === 'expense' ? '-' : '+'} ${this.amount} EGP</td>
            <td class="p-3">${this.category}</td>
            <td class="p-3">${this.date}</td>
                <td>
                    <button class='edit-btn px-3'>📝</button>
                </td>
                <td>
                    <button class='delete-btn px-3'>❌</button>
                </td>
            </tr>
        `;
    }
}