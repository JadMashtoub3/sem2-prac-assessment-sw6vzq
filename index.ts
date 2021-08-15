// Import stylesheets
import './style.css';
import { Colours } from './models/colours.enum';
import { Dice } from './models/dice.enum';
import { Player } from './models/player';
// #region tic tac toe

// NOTE: 'TTT' stands for Tic Tac Toe

// ------- Initialise global variables
// this list is used to store the player and ai's position
// at the start of the game, it will have 9 null elements
let sqList = Array(9).fill(null);

// this list is used to store the square elements
let sqElementList: HTMLElement[] = [];

let isHumanPlayerTurn: boolean = true;

/**
 * Start of the program
 */
function init() {
  createBoard();
}

/**
 * Create the board for the Tic Tac Toe game
 */
function createBoard() {
  const board = document.getElementById('board');

  // create the 9 squares
  for (let i = 0; i < sqList.length; i++) {
    // creating the square
    const sq = document.createElement('div');
    sq.classList.add('square');
    sq.setAttribute('pos', i.toString());

    // when the square is clicked, the playermove() function will execute
    // and we pass the newly created square into the playermove()
    sq.addEventListener('click', function() {
      playerMove(sq);
    });

    sqElementList.push(sq);

    // adding to newly created square into the board
    board.appendChild(sq);
  }
}

/**
 * Fill in the square that the Human player has clicked on with 'X'
 *
 * @param sq the square that the player has clicked on
 */
function playerMove(sq: HTMLElement) {
  // check that player can make a move
  if (isHumanPlayerTurn) {
    // get the pos value from the square
    const pos: number = Number(sq.getAttribute('pos'));
    const hasMoved = move(pos, 'X', sq, true);

    if (hasMoved) {
      // disable the Human player from clicking on the board
      // this is so that the player can't click on the board while the program is calculating the winner and the AI is making its move
      isHumanPlayerTurn = false;

      // call calcWinner() to check if the Human player is the winner
      if (calcWinner() === true) {
        // setting a delay here so that the Human player can see the X drawn onto the screen before the alert is shown
        setTimeout(function() {
          alert('The winner is P1');
        }, 1);
      } else {
        // if Human player is not the winner, then allow the AI to make a move
        // setTimeout() will delays the AI's move onto the board to give the illusion that the AI is 'thinking'
        setTimeout(function() {
          aiMove();

          // once the AI has made its move onto the board, allows the Human player to make a move
          isHumanPlayerTurn = true;
        }, 250);
      }
    }
  }
}

/**
 * Add X or O onto the square
 *
 * @param pos the position of the square on the board
 * @param symbol 'X' for human and 'O' for AI
 * @param isPlayerHuman
 *
 * @return whether the square is filled or not
 */
function move(
  pos: number,
  symbol: string,
  sq: HTMLElement,
  isPlayerHuman: boolean
): boolean {
  // check that the current position is not yet filled by P1 or AI
  // P1 or AI cannot fill in the square if it is already filled in
  if (sqList[pos] === null) {
    sq.textContent = symbol;
    sq.style.color = isPlayerHuman ? 'gold' : 'lightsalmon';

    // fill in the square
    sqList.splice(pos, 1, isPlayerHuman ? 'P1' : 'AI');

    return true;
  }
  return false;
}

/**
 * Calculate the winner for the tic tac toe game using an algorithm
 */
function calcWinner(): boolean {
  const winningPos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winningPos.length; i++) {
    const [a, b, c] = winningPos[i];
    if (sqList[a] && sqList[a] === sqList[b] && sqList[a] === sqList[c]) {
      return true;
    }
  }
  return false;
}

/**
 * Making the move for the AI
 */
function aiMove() {
  // get all of the elements in sqList that are not yet filled with X or O, and then add it to freeSqList
  let freeSqList = [];

  for (let i = 0; i < sqList.length; i++) {
    if (sqList[i] === null) {
      freeSqList.push(i);
    }
  }

  // randomly selects a number. The range is between 0 to the freeSqList.length
  // e.g. if freeSqList has 3 elements, then it is between 0 and 3. So randIndex is expected to be 0, 1 or 2
  const randIndex = Math.floor(Math.random() * freeSqList.length);

  // randIndex is then used as index for freeSqList
  const pos = freeSqList[randIndex];

  move(pos, 'O', sqElementList[pos], false);

  if (calcWinner() === true) {
    setTimeout(function() {
      alert('The winner is AI');
    }, 1);
  }
}

init();

// #endregion
let p1: Player = new Player('Player 1');
let p2: Player = new Player('Player 2');

let players: Player[] = [p1, p2];
let currentplayerid = 0;

let diceSides = 0;
let numDice = 0;

let scoreToWin = 0;

const setupDiv: HTMLElement = document.getElementById('setup');
const playersDiv: HTMLElement = document.getElementById('players');
const turnDiv: HTMLElement = document.getElementById('turn');
const diceDiv: HTMLElement = document.getElementById('dice');

const p1nameInput: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('player1-name-inp')
);
const p2nameInput: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('player2-name-inp')
);
const p1colour: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('player1-colour')
);
const p2colour: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('player2-colour')
);

const diceSelect: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('dice-slt')
);
const diceNoInput: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('dice-no-inp')
);

// score to win input field
const scoreNoInput: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('score-no-inp')
);

// start game button, with onclick behaviour
const startButton: HTMLElement = document.getElementById('start-btn');
startButton.addEventListener('click', startGame);

// player names
const p1name: HTMLElement = document.getElementById('player1-name');
const p2name: HTMLElement = document.getElementById('player2-name');

// player scores
const p1score: HTMLElement = document.getElementById('player1-score');
const p2score: HTMLElement = document.getElementById('player2-score');

// element for displaying name of play whose turn it is
const turnDisplay: HTMLElement = document.getElementById('turn-player');

// roll button, with onclick behaviour
const rollButton: HTMLElement = document.getElementById('roll-btn');
rollButton.addEventListener('click', roll);

// display the winner of the previous game
const winner: HTMLElement = document.getElementById('winner');

/**
 * add options to the dice dropdown and player colour dropdowns based on dice and colour enums
 */
function enumInit() {
  for (let d in Dice) {
    if (isNaN(Number(d))) {
      let newOption: HTMLOptionElement = document.createElement('option');
      newOption.innerHTML = d;
      newOption.value = Dice[d].toString();
      diceSelect.add(newOption);
    }
  }
  // player 1 colour dropdown
  let count = 0;
  for (let c in Colours) {
    if (isNaN(Number(c))) {
      let newOption: HTMLOptionElement = document.createElement('option');
      newOption.innerHTML = c;
      newOption.value = count.toString();
      count++;
      p1colour.add(newOption);
    }
  }
  // player 2 colour dropdown
  count = 0;
  for (let c in Colours) {
    if (isNaN(Number(c))) {
      let newOption: HTMLOptionElement = document.createElement('option');
      newOption.innerHTML = c;
      newOption.value = count.toString();
      count++;
      p2colour.add(newOption);
    }
  }
  // set player 2 to the second option so by default players have different colours
  p2colour.value = '1';
}
enumInit();

/**
 * called by the start game button, hides setup, assigns setup input values to variables used and displays game elements
 */
function startGame() {
  // hide setup
  setupDiv.setAttribute('style', `display: none`);

  // set player names
  p1.name = p1nameInput.value;
  p2.name = p2nameInput.value;

  // display set player names
  p1name.innerHTML = p1.name;
  p2name.innerHTML = p2.name;

  // setup dice and win value
  diceSides = Number(diceSelect.value);
  numDice = Number(diceNoInput.value);
  scoreToWin = Number(scoreNoInput.value);

  // display game
  playersDiv.setAttribute('style', `display:''`);
  turnDiv.setAttribute('style', `display:''`);
  diceDiv.setAttribute('style', `display:''`);
}

function roll() {
  // set player colours to the values in the dropdowns (since dropdowns are not fixed per game)
  p1.colour = Colours[p1colour.value];
  p2.colour = Colours[p2colour.value];

  // select the current player
  let currentplayer = players[currentplayerid];

  // clear previous roll
  diceDiv.innerHTML = '';

  // update owner/roller of dice
  let rolledDisplay = document.createElement('div');
  rolledDisplay.innerHTML = `Dice rolled by ${currentplayer.name}`;
  diceDiv.appendChild(rolledDisplay);

  for (let n = 0; n < numDice; n++) {
   
    const dice = Math.floor(Math.random() * diceSides) + 1;

 
    let dieDiv: HTMLElement = document.createElement('div');
    dieDiv.innerHTML = String(dice);
    dieDiv.classList.add('die');
    dieDiv.setAttribute('style', `background-color: ${currentplayer.colour}`);
    diceDiv.appendChild(dieDiv);


    currentplayer.rolls.push(dice);
    currentplayer.score += dice;
  }

  
  if (currentplayer.score >= scoreToWin) {
    window.alert(`Winner is ${currentplayer.name}`);
  
    winner.innerHTML = `Winner of last game was ${
      currentplayer.name
    } with a score of ${currentplayer.score}`;
   
    for (let p = 0; p < players.length; p++) {
      players[p].score = 0;
      players[p].rolls = [];
    }
   
    currentplayerid = 0;

    setupDiv.setAttribute('style', `display:''`);

  
    playersDiv.setAttribute('style', `display:none`);
    turnDiv.setAttribute('style', `display:none`);
    diceDiv.setAttribute('style', `display:none`);

    diceDiv.innerHTML = '';
  } else {
  
    if (currentplayerid === players.length - 1) {
      currentplayerid = 0;
   
    }
  }
}