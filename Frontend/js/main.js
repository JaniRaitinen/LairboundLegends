'use strict';
/* 1. show map using Leaflet library. (L comes from the Leaflet library) */

const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);

// global variables

// icons
const blueIcon = L.divIcon({className: 'blue-icon'});
const greenIcon = L.divIcon({className: 'green-icon'});

// form for player name

// function to fetch data from API
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Invalid server input!');
  const data = await response.json();
  return data;
}

// function to update game status
function updateStatus(status) {
  document.querySelector('#player-name').innerHTML = `Player: ${status.name}`;
  document.querySelector('#consumed').innerHTML = status.co2.consumed;
  document.querySelector('#budget').innerHTML = status.co2.budget;
}

// function to show weather at selected airport
function showWeather(airport) {
  document.querySelector('#airport-name').innerHTML = `Weather at ${airport.name}`;
  document.querySelector('#airport-temp').innerHTML = `${airport.weather.temp}°C`;
  document.querySelector('#airport-icon').src = airport.weather.icon;
  document.querySelector('#airport-conditions').innerHTML = airport.weather.description;
  document.querySelector('#airport-wind').innerHTML = `${airport.weather.wind.speed}m/s`;
}

// function to check if any goals have been reached

// function to update goal data and goal table in UI
function updateGoals(goals) {
  for(let goal of goals) {
    const li = document.createElement('li');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    img.src = goal.icon;

  }
}

// function to check if game is over

// function to set up game
// this is the main function that creates the game and calls the other functions
async function gameSetup() {
  try {
    const gameData = await getData('testdata/newgame.json');
    console.log(gameData);
    updateStatus(gameData.status);

    for(let airport of gameData.location) {
      const marker = L.marker([airport.latitude, airport.longitude]).addTo(map);
      if(airport.active === true) {
        showWeather(airport);
        marker.bindPopup(`You are here: <b>${airport.name}</b>`);
        marker.openPopup();
        marker.setIcon(greenIcon)
      } else {
        marker.setIcon(blueIcon);
        const popupContent = document.createElement('div');
        const h4 = document.createElement('h4');
        h4.innerHTML = airport.name;
        popupContent.append(h4);
        const goButton = document.createElement('button');
        goButton.classList.add('button')
        goButton.innerHTML = 'Fly here';
        popupContent.append(goButton);
        const p = document.createElement('p');
        p.innerHTML = `Distance ${airport.distance}km`;
        popupContent.append(p);
        marker.bindPopup(popupContent);
      }
    }

  } catch (error) {
    console.log(error);
  }
}

gameSetup();

// event listener to hide goal splash
