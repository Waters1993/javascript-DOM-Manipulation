'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//Update UI function
const updateUI = function (acc) {
  calcDisplayBalance(acc.movements);
  displayMovements(acc.movements);
  displaySummary(acc);
  let elements = document.getElementsByClassName('form__input');
  console.log(elements);
  for (let i = 0; i < elements.length; i++) {
    elements[i].value = '';
  }
};

//Create User Names
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

//Display movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  console.log(movs);
  movs.forEach(function (mov, i) {
    const date = new Date(currentAccount.movementsDates[i]);
    const day = String(date.getDate()).padStart(2, 0);
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    }  ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);

    // Color rows
    [...document.querySelectorAll('.movements__row')].forEach(function (
      row,
      i
    ) {
      if (i % 2 === 0) {
        row.style.backgroundColor = '#E0E0E0';
      } else {
        row.style.backgroundColor = '#F0F0F0';
      }
    });
  });
};

// Calcualte current Balance
const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.innerHTML = `${balance.toFixed(2)} EUR`;
};

//Display summary
const displaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr, arr) => acc + curr);
  labelSumIn.textContent = `${income.toFixed(2)}€`;

  const outgoing = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr);
  labelSumOut.textContent = `${Math.abs(outgoing.toFixed(2))}€`;

  const int = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${int.toFixed(2)}€`;
};

// Login functionality
let currentAccount;

//Fake login
// currentAccount = accounts[0];
// containerApp.style.opacity = 100;
// updateUI(currentAccount);
// inputLoginPin.value = inputLoginUsername.value = '';

//Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    ({ username }) => username === inputLoginUsername.value
  );

  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }`;
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
    inputLoginPin.value = inputLoginUsername.value = '';
  }

  // Add current date
  const now = new Date();
  const day = String(now.getDate()).padStart(2, 0);
  const month = String(now.getMonth() + 1).padStart(2, 0);
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, 0);
  const minute = String(now.getMinutes()).padStart(2, 0);
  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
});

// Transfer functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const value = Number(inputTransferAmount.value);
  const receivingAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  const total = currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);

  if (value < total && receivingAccount) {
    currentAccount.movements.push(-value);
    receivingAccount.movements.push(value);

    currentAccount.movementsDates.push(new Date());
    receivingAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
  }
});

//Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(Math.floor(amount));
    currentAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
  }
});

//Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (user === currentAccount.username && pin === currentAccount.pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  displayMovements(currentAccount.movements, !sort);
  sort = !sort;
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
