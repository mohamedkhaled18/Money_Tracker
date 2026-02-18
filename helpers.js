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