'use strict';
// FOR PIG GAME

const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const game1 = document.querySelector('.main--1');
const game2 = document.querySelector('.main--2');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNext = document.querySelector('.btn__slider--2');
const btnPrevious = document.querySelector('.btn__slider--1');

//Starting Condition
score0El.textContent = 0;
score1El.textContent = 0;
diceEl.classList.add('hidden');

let scores, currentScore, activePlayer, playing;

// Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};

init();

function switchPlayer() {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
}

//Rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing) {
    //1. generating random dice rol
    const dice = Math.trunc(Math.random() * 6) + 1;
    console.log(dice);
    //2. Display dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;
    //3. Check for rolled 1:
    if (dice != 1) {
      //Add dice to current score
      currentScore += dice;
      document.getElementById(
        `current--${activePlayer}`
      ).textContent = currentScore;
    } else {
      //Switch to next player
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    //1. Add current score to the scoreof the active player
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    //2. check if score >= 100;
    if (scores[activePlayer] >= 100) {
      //finish game
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      //switch player
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', init);

// CHANGING GAME
btnNext.addEventListener('click', function () {
  game1.classList.add('hidden');
  game2.classList.remove('hidden');
});

btnPrevious.addEventListener('click', function () {
  game2.classList.add('hidden');
  game1.classList.remove('hidden');
});

//FOR XO Game

const cellElements = document.querySelectorAll('[data-cell]');
const winningMessageTextElement = document.querySelector(
  '[data-winning-message-text]'
);
const winningMessageElement = document.getElementById('winningMessage');
const board = document.getElementById('board');
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const restartButton = document.getElementById('restartButton');
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let circleTurn;

startGame();

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);

  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function startGame() {
  circleTurn = false;
  cellElements.forEach(cell => {
    // once true in the sence ... it will only fire this event once
    cellElements.forEach(cell => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
      cell.removeEventListener('click', handleClick);
      cell.addEventListener('click', handleClick, { once: true });
    });
  });

  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(function (cobinations) {
    return cobinations.every(function (index) {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? 'O' : 'X'} Wins!`;
  }
  winningMessageElement.classList.add('show');
}

function isDraw() {
  return [...cellElements].every(function (cell) {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function handleClick(e) {
  const cell = e.target;
  console.log(e.target);
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

  //place the mark
  placeMark(cell, currentClass);

  //check for win
  if (checkWin(currentClass)) {
    console.log('Winner');
    endGame(false);

    //check for draw
  } else if (isDraw()) {
    endGame(true);
  } else {
    //switch turns
    swapTurns();
    //shows the pseudo x and o
    setBoardHoverClass();
  }
}

cellElements.forEach(function (cell) {
  // once true in the sence ... it will only fire this event once
  return cell.addEventListener('click', handleClick, { once: true });
});

restartButton.addEventListener('click', startGame);
