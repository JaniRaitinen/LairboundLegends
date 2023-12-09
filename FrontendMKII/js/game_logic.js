'use strict';

// Global variables
const apiUrl = 'http://127.0.0.1:3000/';
const shardsGained = [];
let playerLocation = 'EFHK'
let playerName = ''

// Query Selector sections saved as variables (for most this wasn't necessary... maybe I remove these X D)
const playerModal = document.querySelector('#player-modal')
const startButtons = document.querySelector('#start-buttons');
const newGame = document.querySelector('#new-game');
const loadGame = document.querySelector('#load-game');
const newGameForm = document.querySelector('#new-game-form');
const loadGameData = document.querySelector('#load-game-data');
const saveFileList = document.querySelector('#save-files');
const playerForm = document.querySelector('#player-form');

// Backend retrieval function
async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Invalid server input!')
    const data = await response.json();
      return data
  } catch (error) {
    console.log('Error loading data:', error)
  }
}

// function that appends retrieved values to their place
function updateStatus(status) {
  playerName = status.name;
  document.querySelector('#player-name').innerHTML = status.name;
  document.querySelector('#health').innerHTML = status.health;
  document.querySelector('#stamina').innerHTML = status.stamina;
  document.querySelector('#danger').innerHTML = status.danger;
}

// A function that updates the game
async function gameUpdate (url){
  const gameData = await getData(url);
  updateStatus(gameData);

}

// Function to update the riddle
async function updateRiddle (url) {
  const riddle = await getData(url);
  document.querySelector('#riddle').innerText = riddle[0];
}

// Game Initalizing: Title screen control, new game, load game.
newGame.addEventListener('click', () => {
  newGameForm.classList.remove('hide');
  playerForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    playerName = document.querySelector('#player-input').value;
      playerModal.classList.add('hide');
      gameUpdate(`${apiUrl}newgame?player=${playerName}`)
      updateRiddle(`${apiUrl}riddle?player=${playerName}&loc=${playerLocation}`)
  })
});

loadGame.addEventListener('click', async () => {
  loadGameData.classList.remove('hide');
  try {
    const saveData = await getData(`${apiUrl}loaddata`);

    if (!saveData || saveData.length === 0) {
      alert('You have no dragons in your shed... Maybe they have fled?');
    } else {
      for (let i = 0; i < saveData.length; i++) {
        let a = document.createElement('a');
        a.id = saveData[i][0];
        a.innerText = saveData[i][1];
        a.href = '#';
        let li = document.createElement('li');
        li.appendChild(a)
        let span = document.createElement('span');
        span.innerText = ` Stamina: ${saveData[i][2]}, Health: ${saveData[i][5]}`;
        li.appendChild(span)
        saveFileList.append(li);
        a.addEventListener('click', (evt) => {
          evt.preventDefault();
          const playerID = a.id;
          playerModal.classList.add('hide');
          gameUpdate(`${apiUrl}loadgame?id=${playerID}`)
          updateRiddle(`${apiUrl}riddle?player=${playerName}&loc=${playerLocation}`)
        })
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
});



