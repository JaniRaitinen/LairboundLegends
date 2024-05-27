'use strict';

// function that appends retrieved values to their place
function updateStatus(status) {
  playerID = status.id;
  playerName = status.name;
  playerLocation = status.location;
  playerHealth = status.health;
  playerStamina = status.stamina;
  console.log(playerStamina.toString())
  document.querySelector('#player-name').innerHTML = status.name;
  document.querySelector('#health').innerHTML = status.health;
  document.querySelector('#stamina').innerHTML = status.stamina;
  //document.querySelector('#danger').innerHTML = status.danger;
}

// Gets game status from getData() and sends it to updateStatus()
async function gameUpdate (url){
  const gameData = await getData(url);
  console.log(gameData)
  updateStatus(gameData);
}

// Function to update stamina and put it on the screen
function updateStamina (consumption) {
  playerStamina += parseInt(consumption);
  document.querySelector('#stamina').innerHTML = playerStamina;
}

// Function to update health and put it on the screen
function updateHealth (consumption) {
  playerHealth += parseInt(consumption)
  document.querySelector('#health').innerHTML = playerHealth;
}

function updateLocation (nextLoc) {
  playerLocation = nextLoc
}


function updateShards(shards) {
  document.querySelector('#goals').innerHTML = '';
  for (let shard of shards) {
    const li = document.createElement('li');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = shard.icon;
    img.alt = `Shard element: ${shard.name}`;
    figure.append(img);
    li.append(figure);
    if (shard.gained) {
      li.classList.add('gained');
      shardsGained.includes(shard.shardid) || shardsGained.push(shard.shardgained);
    }
    document.querySelector('#goals').append(li);
    }
  }

// Function to update the riddle
async function updateRiddle (url) {
  const riddle = await getData(url);
  document.querySelector('#riddle').innerText = riddle[0];
  currentRiddle = riddle[1];
  console.log(currentRiddle);
}

// Function to update playerId by player name (used in new game because sql created the id)
async function updateId (url) {
  const idData = await getData(url)
  playerID = idData[0]
}

// Function to update lairport and weather info on the screen
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

    const display_offset_y = 0.33
    const display_offset_x = -0.04

    for (let lairport of gameData.location) {
      const marker = L.marker([lairport.latitude+display_offset_y, lairport.longitude+display_offset_x]).addTo(map);
      lairportMarkers.addLayer(marker);
    if (lairport.active) {
      map.flyTo([lairport.latitude, lairport.longitude], 10);
      updateWeather(lairport);
      console.log(lairport);
      checkShards(lairport.weather.meets_shards);
      marker.bindPopup(`You are here: <b>${lairport.name}</b>`);
      marker.openPopup();
      marker.setIcon(locIcon);
      marker.addEventListener('click', () =>{
        sfx.open.play()
      })
    } else {
      marker.setIcon(destIcon);
      marker.addEventListener('click', () =>{
        sfx.open.play()
      })
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
      flyButton.addEventListener('mouseenter', () =>{
        sfx.hover.play()
      })
      flyButton.addEventListener('click',  async () => {
        sfx.start.play()
        await updateLairports(`${apiUrl}flyto?game=${playerID}&dest=${lairport.ident}&nextdis=${playerStamina - lairport.distance}`);
        await updateStamina(-lairport.distance)
        await updateLocation(lairport.ident)
        dialogueBox.innerHTML = await fetchTextDataAtIndex("lairportArrival", Math.floor(Math.random() * 5))
      });
    }
  }
    updateShards(gameData.shards)
} catch (error) {
  console.error(error);
  alert(`${playerName} has lost connection to you... Perhaps you're at fault, too!?`)
  }
}