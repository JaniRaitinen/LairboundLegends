'use strict';
/* 1. show map using Leaflet library. (L comes from the Leaflet library) */

const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);


// Function to change tabs on a scroll
function changeTab(tabName) {
    // Hide all tabs
    let tabs = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    // Show the chosen tab
    document.getElementById(tabName + "-tab").style.display = "block";
}




// global variables
const apiUrl = 'http://127.0.0.1:5000/';
const startLoc = 'EFHK';
const proxy = 'https://users.metropolia.fi/~ilkkamtk/proxy.php?url=';

// icons
const blueIcon = L.divIcon({className: 'blue-icon'});
const greenIcon = L.divIcon({className: 'green-icon'});

// form for player name
document.querySelector('#player-form').addEventListener('submit', function (evt){
      evt.preventDefault();
      const playerName = document.querySelector('#player-input').value;
      document.querySelector('#player-modal').classList.add('hide');
      gameSetup('testdata/newgame.json');
});

// function to fetch data from API
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Invalid server input!');
    console.log(response)
  const data = await response.json();
    console.log(data)
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
  document.querySelector(
      '#airport-name').innerHTML = `Weather at ${airport.name}`;
  document.querySelector(
      '#airport-temp').innerHTML = `${airport.weather.temp}°C`;
  document.querySelector('#weather-icon').src = airport.weather.icon;
  document.querySelector(
      '#airport-conditions').innerHTML = airport.weather.description;
  document.querySelector(
      '#airport-wind').innerHTML = `${airport.weather.wind.speed}m/s`;
}

// function to check if any goals have been reached
function checkGoals(meets_goals) {
  if (meets_goals.length > 0) {
    document.querySelector('.goal').classList.remove('hide');
    location.href = '#goals';
  }
}

// function to update goal data and goal table in UI
function updateGoals(goals) {
  document.querySelector('#goals').innerHTML = '';
  for (let goal of goals) {
    const li = document.createElement('li');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    img.src = goal.icon;
    img.alt = `goal name: ${goal.name}`;
    figcaption.innerHTML = goal.description;
    figure.append(img);
    figure.append(figcaption);
    li.append(figure);
    if (goal.reached) {
      li.classList.add('done');
    }
    document.querySelector('#goals').append(li);
  }
}

// function to check if game is over
function checkGameOver(budget) {
  if (budget <= 0) {
    alert(`Game Over.`);
    return false;
  }
  return true;
}

// function to set up game
// this is the main function that creates the game and calls the other functions
async function gameSetup(url) {
  try {
    const gameData = await getData(url);
    console.log(gameData);
    updateStatus(gameData.status);
    updateGoals(gameData.goals);
    if (!checkGameOver(gameData.status.co2.budget)) return;
    for (let airport of gameData.location) {
      const marker = L.marker([airport.latitude, airport.longitude]).addTo(map);
      if (airport.active) {
        showWeather(airport);
        checkGoals(airport.weather.meets_goals);
        marker.bindPopup(`You are here: <b>${airport.name}</b>`);
        marker.openPopup();
        marker.setIcon(greenIcon);
      } else {
        marker.setIcon(blueIcon);
        const popupContent = document.createElement('div');
        const h4 = document.createElement('h4');
        h4.innerHTML = airport.name;
        popupContent.append(h4);
        const goButton = document.createElement('button');
        goButton.classList.add('button');
        goButton.innerHTML = 'Fly here';
        popupContent.append(goButton);
        const p = document.createElement('p');
        p.innerHTML = `Distance ${airport.distance}km`;
        popupContent.append(p);
        marker.bindPopup(popupContent);
        goButton.addEventListener('click', function() {
          gameSetup('testdata/newgame.json');
        });
      }
    }

  } catch (error) {
    console.log(error);
  }
}

// event listener to hide goal splash
document.querySelector('.goal').addEventListener('click', function(evt) {
  evt.currentTarget.classList.add('hide');
});
