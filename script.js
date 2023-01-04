'use strict';

// BANKIST APP

/// Hard Coded Data
const account1 = {
  owner: 'James Waters',
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
  locale: 'en-IE',
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
  currency: 'GBP',
  locale: 'en-GB',
};

const account3 = {
  owner: 'Brian Smith',
  movements: [4200, 2200, -180, -990, -3210, -500, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2022-12-18T16:33:06.386Z',
    '2023-01-03T14:43:26.374Z',
    '2023-01-01T18:49:59.371Z',
    '2022-12-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

//Array of User Accounts
const accounts = [account1, account2, account3];

// DOM Element Selectors
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
// FUNCTIONS

// Update UI
const updateUI = function (acc) {
  calcDisplayBalance(acc.movements);
  displayMovements(acc.movements);
  displaySummary(acc);

  // Clear form fields
  let elements = document.getElementsByClassName('form__input');
  console.log(elements);
  for (let i = 0; i < elements.length; i++) {
    elements[i].value = '';
  }
};

// Currency formatter (Internationalization)
const formatCurrency = function (acc, value) {
  const options = {
    style: 'currency',
    currency: acc.currency,
  };
  const x = new Intl.NumberFormat(acc.locale, options).format(value);
  return x;
};

//Date formatter for movements (Internationalization)
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Create two letter usernames from Owner names
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

// Log out timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 2 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// DOM Manipulation

// Display movements (user transactions table)
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const date = new Date(currentAccount.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // prettier-ignore
    const html = 
    `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1}  ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatCurrency(currentAccount, mov)}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);

    // Color rows
    // prettier-ignore
    [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
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
  labelBalance.innerHTML = `${formatCurrency(currentAccount, balance)}`;
};

// Login functionality
let currentAccount, timer;

///// Simulate login for testing
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

  // Welcome back message with users first name
  // prettier-ignore
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
    inputLoginPin.value = inputLoginUsername.value = '';

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Start Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Transfer functionality between accounts
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

//Close active users account
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

// Sort movements (transactions)
let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  displayMovements(currentAccount.movements, !sort);
  sort = !sort;
});

//Display  footer summary
const displaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr, arr) => acc + curr);
  labelSumIn.textContent = `${formatCurrency(currentAccount, income)}€`;

  const outgoing = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr);

  labelSumOut.textContent = `${formatCurrency(
    currentAccount,
    Math.abs(outgoing)
  )}`;

  const int = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${formatCurrency(currentAccount, int)}€`;
};
