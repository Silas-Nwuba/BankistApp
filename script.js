'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDate: [
    '2019-11-18T21:31:17.178Z',
    '2020-12-01T10:42:02.383Z',
    '2017-06-04T11:15:04.904Z',
    '2016-05-08T12:17:24.185Z',
    '2022-12-11T02:11:59.604Z',
    '2022-12-13T09:01:17.194Z',
    '2022-12-15T08:36:17.929Z',
    '2022-12-16T07:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDate: [
    '2012-11-18T21:31:17.178Z',
    '2004-12-01T10:42:02.383Z',
    '2018-06-04T11:15:04.904Z',
    '2017-05-10T12:17:24.185Z',
    '2017-09-15T02:11:59.604Z',
    '2020-12-14T09:01:17.194Z',
    '2022-10-17T08:36:16.929Z',
    '2022-12-16T07:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'Pt-PT',
};
const account3 = {
  owner: 'Nwuba silas',
  movements: [9000, 2000, -100, -700, -2410, -1000, 400, -300],
  interestRate: 1.7,
  pin: 3333,

  movementsDate: [
    '2012-11-18T21:31:17.178Z',
    '2004-12-01T10:42:02.383Z',
    '2018-06-04T11:15:04.904Z',
    '2017-05-10T12:17:24.185Z',
    '2017-09-15T02:11:59.604Z',
    '2020-12-14T09:01:17.194Z',
    '2022-10-17T08:36:16.929Z',
    '2022-12-16T07:51:36.790Z',
  ],
  currency: 'NGN',
  locale: 'en-NG',
};
//de-DE

const accounts = [account1, account2, account3];

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
////////////////////////////////////////////

//adding date the app

// creating username for each account
const username = accounts.forEach(user => {
  user.username = user.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
});

//creating a function to cal date
const formattedDate = function (date, locale) {
  const calDatePassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const displayDatePassed = calDatePassed(new Date(), date);
  if (displayDatePassed === 0) return 'Today';
  if (displayDatePassed === 1) return 'Yesterday';
  if (displayDatePassed <= 7) return `${displayDatePassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};
const formattedAmount = function (mov, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(mov);
};
const displayMovement = function (acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit ' : 'withdrawal';
    const date = new Date(acc.movementsDate[i]);
    const displayDate = formattedDate(date, acc.locale);
    const displayAmount = formattedAmount(mov, acc.locale, acc.currency);
    const html = `
          <div class="movements__row">
         <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
         <div class="movements__date">${displayDate}</div>
         <div class="movements__value">${displayAmount}</div>
         </div>
         `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// display summary
const summaryAccount = function (acc) {
  //display depositeSummary
  const depositeSummary = acc.movements
    .filter(deposit => deposit > 0)
    .reduce((acc, cur) => acc + cur, 0);

  const totalDeposite = formattedAmount(
    depositeSummary,
    acc.locale,
    acc.currency
  );

  labelSumIn.textContent = `${totalDeposite}`.replaceAll('-', '');

  // display withdrawalSummary
  const withdrawalSummary = acc.movements
    .filter(deposit => deposit < 0)
    .reduce((acc, cur) => acc + cur, 0);
  const totalWithdraw = formattedAmount(
    withdrawalSummary,
    acc.locale,
    acc.currency
  );

  labelSumOut.textContent = `${totalWithdraw}`.replaceAll('-', '');

  //display interestSummary
  const interestSummary = acc.movements
    .filter(interest => interest > 0)
    .map(interest => (interest * acc.interestRate) / 100)
    .reduce((acc, cur) => acc + cur, 0);
  const totalInterest = formattedAmount(
    interestSummary,
    acc.locale,
    acc.currency
  );

  labelSumInterest.textContent = `${totalInterest}`.replaceAll('-', '');
};

const updateUI = function (acc) {
  //calDepositeBalance
  calDepositBalance(acc);

  //displayMovement
  displayMovement(acc);

  //summaryAccount
  summaryAccount(acc);
};

//Timers
const starLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min} : ${sec}`;
    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'login to get started';
      clearInterval(timer);
    }
    time--;
  };
  let time = 30;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//login user
let usersAcct, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const user = inputLoginUsername.value;
  const passwordPin = Number(inputLoginPin.value);
  usersAcct = accounts.find(
    name => name.username === user && name.pin === passwordPin
  );
  // display UI wlcoome message
  if (usersAcct) {
    const userlogged = usersAcct.owner.split(' ');
    labelWelcome.innerHTML = `Welcome back ${userlogged[0]}`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //timer function call
    if (timer) clearInterval(timer);
    timer = starLogoutTimer();

    updateUI(usersAcct);
  } else if (!usersAcct) {
    alert('Account notFound..');
  } else {
    alert('please enter a valid details..');
  }
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  labelDate.textContent = new Intl.DateTimeFormat(
    usersAcct.locale,
    options
  ).format(now);

  inputCloseUsername.value = inputClosePin.value = '';
});
//user transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const recieveAcct = accounts.find(
    names => names.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  setTimeout(function () {
    if (
      transferAmount > 0 &&
      recieveAcct &&
      usersAcct.balance >= transferAmount &&
      recieveAcct?.username !== usersAcct.username
    ) {
      usersAcct.movements.push(-transferAmount);
      recieveAcct.movements.push(transferAmount);
      //added date to the movement date
      usersAcct.movementsDate.push(new Date().toISOString());
      //added date to the  receiver acct movement date
      recieveAcct.movementsDate.push(new Date().toISOString());
      updateUI(usersAcct);
    } else {
      alert('please verify the tranfer username');
    }
    clearInterval(timer);
    timer = starLogoutTimer();
  }, 2000);
});

//btnLoan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const inputLoan = Math.floor(inputLoanAmount.value);
  setTimeout(function () {
    if (
      inputLoan > 0 &&
      usersAcct.movements.some(mov => mov >= inputLoan * 0.1)
    ) {
      const requestAcc = usersAcct.movements;
      requestAcc.push(inputLoan);
      //added date to the movement date
      usersAcct.movementsDate.push(new Date().toISOString());

      updateUI(usersAcct);
    }
    inputLoanAmount.value = '';

    clearInterval(timer);
    timer = starLogoutTimer();
  }, 2000);
});

//close acc
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    usersAcct.username === inputCloseUsername.value &&
    usersAcct.pin === Number(inputClosePin.value)
  ) {
    const currentUserAcct = accounts.findIndex(
      user =>
        user.username === inputCloseUsername.value &&
        user.pin === Number(inputClosePin.value)
    );
    accounts.splice(currentUserAcct, 1);
  }
  inputCloseUsername.value = inputClosePin.value = '';
  containerApp.style.opacity = 0;
});

const calDepositBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  const displayTotalBalance = formattedAmount(
    acc.balance,
    acc.locale,
    acc.currency
  );
  labelBalance.innerHTML = `${displayTotalBalance}`;
};

//pratices
//setTimeOut() : is a timer function that requires a
//calllback function and a time in milleseconds it irun just ones with a specific time

// const ingredient = ['pizza', 'shawama'];
// const timers = setTimeout(
//   (item, item2) => console.log(`i love eating ${item} and ${item2}`),
//   3000,
//   'barbeque',
//   ingredient
// );

// if (ingredient.includes('shawama')) {
//   clearTimeout(timers);
// }

// // setInterval()is a timer that run repeated with a Specific time until we clear the interval
// //build clock with setInterval

// const interval = setInterval(function () {
//   const dateTest = new Date();
//   const date = dateTest.getDate();
//   const month = dateTest.getMonth() + 1;
//   const year = dateTest.getFullYear();
//   const hour = dateTest.getHours();
//   const minute = dateTest.getMinutes();
//   const second = dateTest.getSeconds();
//   console.log(` ${year}-${month}-${date} - ${hour}:${minute}:${second}`);
// }, 1000);

// clearInterval(interval);
