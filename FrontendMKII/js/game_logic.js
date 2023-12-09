'use strict';

// Global variables
const apiUrl = 'http://127.0.0.1:3000/';
const shardsGained = [];

// Query Selector sections saved as variables
const startButtons = document.querySelector('#start-buttons');
const newGame = document.querySelector('#new-game');
const loadGame = document.querySelector('#load-game');
const newGameForm = document.querySelector('#new-game-form');
const loadGameData = document.querySelector('#load-game-data');
const saveFileList = document.querySelector('#save-files')

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

// Game Initalizing: Title screen control, new game etc.
newGame.addEventListener('click', () => {
  newGameForm.classList.remove('hide');
});

loadGame.addEventListener('click', async () => {
  loadGameData.classList.remove('hide');
  try {
    const saveData = await getData(`${apiUrl}loaddata`);

    if (!saveData || saveData.length === 0) {
      alert('You have no dragons in your shed... Maybe they have fled?');
    } else {
      for (let i = 0; i < saveData.length; i++) {
        let li = document.createElement('li');
        li.innerText = `${saveData[i][1]}, Stamina: ${saveData[i][3]}, Health: ${saveData[i][5]}`;
        saveFileList.append(li);
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
});



