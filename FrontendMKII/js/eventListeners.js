'use strict';

// SOUND EVENT LISTENERS
document.getElementById('newgamebutton').addEventListener('click', () =>{
  sfx.open.play()
})

newGame.addEventListener('mouseenter', () =>{
  sfx.hover.play()
})

loadGame.addEventListener('mouseenter', () =>{
  sfx.hover.play()
})

statusButton[0].addEventListener('mouseenter', () =>{
  sfx.hover.play()
})
statusButton[0].addEventListener('click', () =>{
  sfx.open.play()
})

lairButton[0].addEventListener('mouseenter', () =>{
  sfx.hover.play()
})
lairButton[0].addEventListener('click', () =>{
  sfx.open.play()
})

aboutButton[0].addEventListener('mouseenter', () =>{
  sfx.hover.play()
})
aboutButton[0].addEventListener('click', () =>{
  sfx.open.play()
})

tavernButton.addEventListener('mouseenter', () =>{
  sfx.hover.play()
})

healthPotion.addEventListener('mouseenter', () => {
  sfx.hover.play()
})

for (let i = 0 ; i < closeButton.length; i++){
  closeButton[i].addEventListener('mouseenter', () =>{
  sfx.hover.play()
})
  closeButton[i].addEventListener('click', () =>{
  sfx.open.play()
})
}

staminaPotion.addEventListener('mouseenter', () => {
  sfx.hover.play()
})

oracle.addEventListener('mouseenter', () =>{
  sfx.hover.play()
})

// ACTION EVENT LISTENERS
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

tavernButton.addEventListener('click', () => {
  sfx.open.play();
  tavernModal.style.display = "flex";
  modal.showModal();
  openCheck(modal);
});


  //sulkee kaupan
span.addEventListener('click', () =>{
  sfx.close.play();
  modal.close()
  tavernModal.style.display = "none";
  openCheck(modal)
  prophecy.innerHTML = 'Ask the oracle for guidance.'
})

healthPotion.addEventListener('click', () => {
  updateHealth(200)
  sfx.potion.play()
  console.log('health!')
  console.log(playerHealth)
  // let danger_global = danger_global + Math.floor(Math.random()*6)+1
});

staminaPotion.addEventListener('click', () =>{
  updateStamina(200)
  sfx.potion.play()
  console.log('stamina!')
  console.log(playerStamina)
  // let danger_global = danger_global + Math.floor(Math.random()*6)+1
})

oracle.addEventListener('click',  async () => {
  prophecy.innerHTML = 'Let me gaze into the vortex, to find out where you should head next. Please be patient while I work.'
  let direction = await getData(`${apiUrl}closest_weather?loc=${playerLocation}&target=${currentRiddle}`);
  sfx.magic.play()
  console.log(direction)
  prophecy.innerHTML = `Your fortune in <strong>${direction.direction}</strong> i see. <br> 
                        There is the lair where you need to be`
})
