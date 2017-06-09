const transactions = [];

export function balance() {
  return transactions.reduce((state, next) => {
    state.balance += next.amount;
    return state;
  }, { balance: 0 });
}

export function add(amount) {
  transactions.push({ amount });
}

export function withdraw(amount) {
  transactions.push({ amount: amount * -1 });
}

