// Battle Minigame


  // Load Battle background image
  let battleBackgroundImage
  // Create new battlebackground sprite
  let battleBackground
  // Create new Monster instance depenging on the current weather
  let draggle
  // Emby is always the player
  let emby
  // List of sprites excluding the background to draw
  let renderedSprites
  // Animate (Render) images onto the canvas using AnimationFrame
  let animationID
  // Queue array for "queueing" all that happens in game, depending on input
  let queue
  let clicked

  // Get the healthbarName elements
  const healthbar1NameElement =  document.querySelector('#healthBar1Name'); // Enemy
  const healthbar2NameElement =  document.querySelector('#healthBar2Name'); // Player

   // Load Data for new battle instance
  function initBattle(weatherCondition) {

    minigameModal.style.display = 'block';
    const infoScroll = document.querySelector('#scroll')
    const dialogueMain = document.querySelector('#dialogue')
    dialogueMain.style.display = 'none'
    infoScroll.style.display = 'none'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#attacksBox').replaceChildren()

    emby = new Monster(monsters.Emby);
    draggle = getEnemy(weatherCondition);
    renderedSprites = [draggle, emby];
    queue = []

    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#enemyHealthBar').style.width = '100%'

    // Set the name element of the healthbars to its name
    healthbar1NameElement.innerHTML =  draggle.name;
    healthbar2NameElement.innerHTML =  emby.name;

    clicked = false

    battleBackgroundImage =  new Image();
    battleBackgroundImage.src = getBackgroundImage(weatherCondition)
    battleBackground =  new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    image: battleBackgroundImage,
    });

    audio.Battle.play();
    animateBattle()

    draggle.resetPosition()
    // Create a button for each player's attacks
    emby.attacks.forEach(attack => {
    const button = document.createElement('button');
    button.innerHTML = attack.name;
    button.addEventListener("mouseover", async() => {
      audio.Hover.play()
    })
    document.querySelector('#attacksBox').append(button);
    });


    // Create an event listener for each button element on screen
   document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      // Call player.attack and complete the attack function
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });
      // After the attack check if enemy's health is zero or below
      if (draggle.health <= 0) {
        // Push an enemy.faint() method to the queue
        queue.push(() => {
          // Game Won! :]
          audio.BattleVictory.play()
          draggle.faint();
        });
        // After fainting push an animation event (gsap.to) to the queue
        queue.push(() => {
          gsap.to('#overlappingDiv', {
            opacity: 1,
            // On animation completion disable the display of minigameModal
            onComplete: () => {
              // returnHP(emby.health)
              cancelAnimationFrame(animationID)
              minigameModal.style.display = 'none';
              document.querySelector('#scroll').style.display = 'block'
              document.querySelector('#dialogue').style.display = 'block'
              gsap.to('#overlappingDiv', {
                opacity: 0,
              })
              return
            },
          });
        });
        return
      }
      // Enemy's turn to attack back. The attack choice is randomized from avaivable attacks
      const randomAttack = draggle.attacks[Math.floor(
          Math.random() * draggle.attacks.length)];
      // push an enemy.attack method to the queue
      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites,
        });
        // If the player's health is zero or below.
        if (emby.health <= 0) {
          // push an enemy.faint method to the queue
          queue.push(() => {
            // Peli Hävitty!
            audio.BattleLose.play()
            emby.faint();
          });
          // After the enemy.faint method push an animation event to the queue
          queue.push(() => {
            gsap.to('#overlappingDiv', {
              opacity: 1,
              // On completion of the animation disable the minigameModal display
              onComplete: () => {
                // returnHP(emby.health)
                cancelAnimationFrame(animationID)
                minigameModal.style.display = 'none';
                document.querySelector('#scroll').style.display = 'block'
                document.querySelector('#dialogue').style.display = 'block'
                gsap.to('#overlappingDiv', {
                  opacity: 0,
                })
                return
              },
            });
          });
          return
        }
      });
    });
    // Add an event listener to all buttons. On mouse enter show the attacks type and color on screen
    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector('#attackType').innerHTML = selectedAttack.type;
      document.querySelector('#attackType').style.color = selectedAttack.color;
    });
  });

  }

  function animateBattle() {
    animationID = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach((sprite) => {
      sprite.draw();
    });
  }

  // Add an event listener to the dialogBox which appears when there is a method in the queue
   document.querySelector('#dialogueBox').
      addEventListener('click', (e) => {
        if (queue.length > 0) {
          // Get the first method of the queue and call it
          queue[0]();
          // After that remove the called method from the queue
          queue.shift();
        } else {
          // disable the dialogbox's display to hide it after all methods from the queue have been called
          e.currentTarget.style.display = 'none';
        }
      });

  // Handling for initializing battle in battledebug.html.
  // shows the modal in which the battle resides
  const debugActivateElement = document.querySelector('#DEBUGACTIVATE')

  debugActivateElement.addEventListener('click', () => {
      initBattle("-20DEG")
  });

  // async function returnHP(playerHp) {
  //   try {
  //     const roundHP = Math.floor(playerHp)
  //     const response = await fetch(`http://127.0.0.1:5000/getPlayerHp?playerHp=${roundHP}`)
  //     const jsonResponse = await response.json()
  //     console.log(jsonResponse)
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  //   finally {
  //     console.log("Game Data Saved to DB")
  //   }
  // }
