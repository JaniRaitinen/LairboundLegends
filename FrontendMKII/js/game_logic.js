'use strict';

// Global variables
const apiUrl = 'http://127.0.0.1:3000/';
const shardsGained = [];
let playerLocation = ''
let playerName = ''
let playerID = 0
let playerHealth = 0
let playerStamina = 0

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
  playerID = status.id;
  playerName = status.name;
  playerLocation = status.location;
  playerHealth = status.health;
  playerStamina = status.stamina;
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

// Function to update playerId by player name (used in new game because sql created the id)
async function updateId (url) {
  const idData = await getData(url)
  playerID = idData[0]
}

function updateLocation (location) {
  playerLocation = location
}

function updateWeather (lairport) {
  document.querySelector('#lairport-name').innerHTML = lairport.name;
  document.querySelector('#airport-conditions').innerHTML = `${lairport.weather.temp}ºC<br>${lairport.weather.description}`
  document.querySelector('#weather-icon').src = lairport.weather.icon;
}

// Function to update lairport markers. Might be impossible NOT to make the main gameplay loop function
async function updateLairports(url) {
  try {
    lairportMarkers.clearLayers();
    const gameData = await getData(url)
    console.log(gameData);
    for (let lairport of gameData.location) {
      const marker = L.marker([lairport.latitude, lairport.longitude]).addTo(map);
      lairportMarkers.addLayer(marker);
    if (lairport.active) {
      map.flyTo([lairport.latitude, lairport.longitude], 10);
      console.log(lairport)
      //updateWeather(lairport)
      //checkShards -funktio?
      marker.bindPopup(`You are here: <b>${lairport.name}</b>`);
      marker.openPopup();
      marker.setIcon(locIcon);
    } else {
      marker.setIcon(destIcon);
      const popupContent = document.createElement('div');
      const h4 = document.createElement('h4');
      h4.innerHTML = lairport.name;
      popupContent.append(h4)
      const flyButton = document.createElement('button');
      flyButton.classList.add('fly-button');
      flyButton.innerHTML = 'Take Flight';
      popupContent.append(flyButton);
      const p = document.createElement('p');
      p.innerHTML = `Distance ${lairport.distance} km`;
      popupContent.append(p);
      marker.bindPopup(popupContent);
      flyButton.addEventListener('click',  () => {
        updateLairports(`${apiUrl}flyto?game=${playerID}&dest=${lairport.ident}`)
      });
    }
  }
} catch (error) {
  console.error(error);
  }
}


// Game Initalizing: New game, load game and title screen handling.
newGame.addEventListener('click', () => {
  newGameForm.classList.remove('hide');
  playerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    playerName = document.querySelector('#player-input').value;
      playerModal.classList.add('hide');
      await gameUpdate(`${apiUrl}newgame?player=${playerName}`);
      await updateId(`${apiUrl}fetchid?player=${playerName}`);
      await updateRiddle(`${apiUrl}riddle?player=${playerName}&loc=${playerLocation}`);
      await updateLairports(`${apiUrl}flyto?game=${playerID}&dest=${playerLocation}&consumption=${0}`);
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
        a.addEventListener('click', async (evt) => {
          evt.preventDefault();
          const linkPlayerID = a.id;
          playerModal.classList.add('hide');
          await gameUpdate(`${apiUrl}loadgame?id=${linkPlayerID}`);
          await updateRiddle(`${apiUrl}riddle?player=${playerName}&loc=${playerLocation}`);
          await updateLairports(`${apiUrl}flyto?game=${playerID}&dest=${playerLocation}&consumption=${0}`);
        })
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
});


