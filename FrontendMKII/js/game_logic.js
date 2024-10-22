'use strict';

// Global variables
const apiUrl = 'http://127.0.0.1:3000/';
const shardsGained = [];
let playerLocation = ''
let playerName = ''
let playerID = 0
let currentRiddle = 4
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
const dialogueBox = document.querySelector('#dialogue-content');
const tavernModal = document.querySelector('#tavern-modal');

function menuMusic(status) {
  Howler.stop()
    if(status === 'play') {
         let music1 = new Howl({
            src: ['sound/menu-loop.wav'],
            autoplay: false,
            loop: true,
            onend: function() {
                console.log("Loop finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['sound/menu-intro.wav'],
            autoplay: true,
            loop: false,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Intro finished!") //For debugging
                music1.play()
            }
        });
    } else if (status === 'stop'){
      Howler.stop()
    }
}

function mapMusic(status) {
  menuMusic('stop')
    if(status === 'play') {
         let music1 = new Howl({
            src: ['sound/map-loop.wav'],
            autoplay: false,
            loop: true,
            onend: function() {
                console.log("Intro finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['sound/map-loop.wav'],
            autoplay: true,
            loop: false,
            onend: function() {
                console.log("Loop finished!") //For debugging
                music.play()
            }
        });
    } else if (status === 'stop'){
      Howler.stop()
    }
}


const sfx = {
  hover: new Howl({
    src: 'sound/hover.mp3'
  }),
  open: new Howl({
    src: 'sound/open.mp3'
  }),
  close: new Howl({
    src: 'sound/close.mp3'
  }),
  attack: new Howl({
    src: 'sound/attack.mp3'
  }),
  fireball: new Howl({
    src: 'sound/fireball.mp3'
  }),
  potion: new Howl({
    src: 'sound/potion.mp3'
  }),
  start: new Howl({
    src: 'sound/start.mp3'
  }),
  victory: new Howl({
    src: 'sound/victory.wav'
  }),
  lose: new Howl({
    src: 'sound/lose.wav'
  }),
  magic: new Howl({
    src: 'sound/magic.wav'
  }),
  water: new Howl({
    src: 'sound/water.wav'
  }),
  hploss: new Howl({
    src: 'sound/hploss.wav'
  }),
  hammer: new Howl({
    src: 'sound/hammer.wav'
  }),
  sword: new Howl({
    src: 'sound/sword.wav'
  }),
  thunder: new Howl({
    src: 'sound/thunder.wav'
  }),
  ice: new Howl({
    src: 'sound/ice.wav'
  }),
  slash: new Howl({
    src: 'sound/slash.wav'
  }),
  whoosh: new Howl({
    src: 'sound/whoosh.wav'
  })
}

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
  //document.querySelector('#danger').innerHTML = status.danger;
}

// Function to update stamina and put it on the screen
function updateStamina (consumption) {
  playerStamina += consumption;
  document.querySelector('#stamina').innerHTML = playerStamina;
}

// Function to update health and put it on the screen
function updateHealth (consumption) {
  playerHealth += consumption;
  document.querySelector('#health').innerHTML = playerHealth;
}

function updateLocation (nextLoc) {
  playerLocation = nextLoc
}

async function checkShards (gains_shard) {
  if (gains_shard.length > 0) {
    for (let shard of gains_shard) {
      if (shard === currentRiddle) {
        if (!shardsGained.includes(shard)) {
          //document.querySelector('.shard').classList.remove('hide');
          location.href = '#shards';
          shardsGained.push(shard)
          console.log(shardsGained)
          alert('A wonderful Dragonbound you are - you and your dragon have found a shard!')
          await updateRiddle(`${apiUrl}riddle?player=${playerName}&loc=${playerLocation}&shards=${shardsGained}`)
        }
      }
      }

  }
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


function typeWriter(text, speed, targetElement) {
  let i = 0
  if (i < text.length) {
    targetElement += text.charAt(i)
    i++;
    setTimeout(typeWriter, speed)
  }
}

// A function that updates the game
async function gameUpdate (url){
  const gameData = await getData(url);
  console.log(gameData)
  updateStatus(gameData);
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

async function fetchTextDataAtIndex(textId, index) {
  const textData = await getData(`${apiUrl}fetchTextAtIndex?name=${playerName}&playerLocation=${playerLocation}&textId=${textId}&index=${index}`)
  return textData
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

menuMusic('play')

document.getElementById('newgamebutton').addEventListener('click', () =>{
  sfx.open.play()
})

// Game Initalizing: New game, load game and title screen handling.
newGame.addEventListener('click', async() => {
  sfx.open.play()
  newGameForm.classList.remove('hide');
  const playerStartLore = document.querySelector('#new-game-lore')
  const textId = "namingYourDragon"
  const lore = await getData(`${apiUrl}fetchText?name='none'&loc=${playerLocation}&textId=${textId}`)
  playerStartLore.innerHTML = lore
  playerForm.addEventListener('mouseenter', () =>{
    sfx.hover.play()
  })
  playerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    playerName = document.querySelector('#player-input').value;
      playerModal.classList.add('hide');
      mapMusic('play')
      await gameUpdate(`${apiUrl}newgame?player=${playerName}`);
      await updateId(`${apiUrl}fetchid?player=${playerName}`);
      await updateRiddle(`${apiUrl}riddle?player=${playerName}&loc=${playerLocation}`);
      await updateLairports(`${apiUrl}flyto?game=${playerID}&dest=${playerLocation}&nextdis=${playerStamina}`);
      dialogueBox.innerHTML = await fetchTextDataAtIndex("lairportArrival", Math.floor(Math.random() * 5))
  })
});

newGame.addEventListener('mouseenter', () =>{
  sfx.hover.play()
})

loadGame.addEventListener('mouseenter', () =>{
  sfx.hover.play()
})

loadGame.addEventListener('click', async () => {
  sfx.open.play()
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
        li.addEventListener('click', () =>{
          sfx.start.play()
        })
        a.addEventListener('click', async (evt) => {
          evt.preventDefault();
          const linkPlayerID = a.id;
          playerModal.classList.add('hide');
          mapMusic('play')
          await gameUpdate(`${apiUrl}loadgame?id=${linkPlayerID}`);
          await updateRiddle(`${apiUrl}riddle?player=${playerName}&loc=${playerLocation}&shards=${shardsGained}`);
          await updateLairports(`${apiUrl}flyto?game=${playerID}&dest=${playerLocation}&nextdis=${playerStamina}`);

          const textId = "lairportArrival"
          const index = Math.floor(Math.random() * 5)
          const textData = await getData(`${apiUrl}fetchTextAtIndex?name=${playerName}&playerLocation=${playerLocation}&textId=${textId}&index=${index}`)
          dialogueBox.innerHTML = textData
        })
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
});

const statusButton = document.getElementsByClassName('status-button')
statusButton[0].addEventListener('mouseenter', () =>{
  sfx.hover.play()
})
statusButton[0].addEventListener('click', () =>{
  sfx.open.play()
})

const lairButton = document.getElementsByClassName('lair-button')
lairButton[0].addEventListener('mouseenter', () =>{
  sfx.hover.play()
})
lairButton[0].addEventListener('click', () =>{
  sfx.open.play()
})

const aboutButton = document.getElementsByClassName('about-button')
aboutButton[0].addEventListener('mouseenter', () =>{
  sfx.hover.play()
})
aboutButton[0].addEventListener('click', () =>{
  sfx.open.play()
})

const closeButton = document.getElementsByClassName('close-button')
for (let i = 0 ; i < closeButton.length; i++){
  closeButton[i].addEventListener('mouseenter', () =>{
  sfx.hover.play()
})
  closeButton[i].addEventListener('click', () =>{
  sfx.open.play()
})
}




const modal = document.querySelector('dialog')
const tavernButton = document.getElementById('tavern-picture')

tavernButton.addEventListener('mouseenter', () =>{
  sfx.hover.play()
})
tavernButton.addEventListener('click', () => {
  sfx.open.play();
  tavernModal.style.display = "flex";
  modal.showModal();
  openCheck(modal);
});

function openCheck(modal) {
  if (modal.open) {
    console.log("Dialog open");
  } else {
    console.log("Dialog closed");
  }
}

// Taverna

const span = document.querySelector('span')

//sulkee kaupan
span.addEventListener('click', () =>{
  sfx.close.play();
  modal.close()
  tavernModal.style.display = "none";
  openCheck(modal)
  prophecy.innerHTML = 'Ask the oracle for guidance.'
})

const healthPotion = document.getElementById('hp-potion');
healthPotion.addEventListener('click', () => {
  updateHealth(200)
  sfx.potion.play()
  console.log('health!')
  console.log(playerHealth)
  // let danger_global = danger_global + Math.floor(Math.random()*6)+1
});

healthPotion.addEventListener('mouseenter', () => {
  sfx.hover.play()
})

const staminaPotion = document.getElementById('stamina-potion');
staminaPotion.addEventListener('click', () =>{
  updateStamina(200)
  sfx.potion.play()
  console.log('stamina!')
  console.log(playerStamina)
  // let danger_global = danger_global + Math.floor(Math.random()*6)+1
})

staminaPotion.addEventListener('mouseenter', () => {
  sfx.hover.play()
})

const prophecy = document.getElementById('prophecy')
const oracle = document.getElementById('oracle');
oracle.addEventListener('click',  async () => {
  prophecy.innerHTML = 'Let me gaze into the vortex, to find out where you should head next. Please be patient while I work.'
  let direction = await getData(`${apiUrl}closest_weather?loc=${playerLocation}&target=${currentRiddle}`);
  sfx.magic.play()
  console.log(direction)
  prophecy.innerHTML = `Your fortune in <strong>${direction.direction}</strong> i see. <br> 
                        There is the lair where you need to be`
})

oracle.addEventListener('mouseenter', () =>{
  sfx.hover.play()
})