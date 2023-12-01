function initializeBattle() {
  // Data For Audio
  const audio = {
    Battle: new Howl({
      src: 'BattleMinigame/BattleMinigameData/Lairbound_battle.mp3',
      html5: true,
    }),
  };
  // Data for Attacks
  const attacks = {
    Tackle: {
      name: 'Tackle',
      damage: 10,
      type: 'Normal',
      color: 'beige',
    },
    Fireball: {
      name: 'Fireball',
      damage: 10,
      type: 'Fire',
      color: 'orange',
    },
    IceShard: {
      name: 'IceShard',
      damage: 10,
      type: 'Ice',
      color: 'blue',
    },
    ThunderStrike: {
      name: 'ThunderStrike',
      damage: 10,
      type: 'Electric',
      color: 'yellow',
    },
  };
  
  // Load Player Image
  const embyImage =  new Image();
  embyImage.src = 'BattleMinigame/BattleMinigameData/PlayerDragonSprite.png';

  // Load Enemy Image
  const draggleImage =  new Image();
  draggleImage.src = 'BattleMinigame/BattleMinigameData/YoungIceDragonSprite.png';

  const knightImage =  new Image();
  knightImage.src = 'BattleMinigame/BattleMinigameData/knightSprite.png';

  // Monster Data, Needs to have played and enemy images loaded before this
  const monsters = {
    Emby: {
      position: {
        x: 100,
        y: 280,
      },
      image: embyImage,
      frames: {
        max: 4,
        hold: 60,
      },
      animate: true,
      name: 'Player Dragon Name',
      type: 'Fire',
      attacks: [
        attacks.Tackle,
        attacks.Fireball,
        attacks.IceShard,
        attacks.ThunderStrike],
    },
    Draggle: {
      position: {
        x: 730,
        y: 300,
      },
      image: draggleImage,
      frames: {
        max: 4,
        hold: 60,
      },
      animate: true,
      isEnemy: true,
      name: 'Young Ice Dragon',
      type: 'Ice',
      attacks: [attacks.Tackle, attacks.IceShard],
    },
    Knight: {
      position: {
        x: 730,
        y: 300,
      },
      image: knightImage,
      frames: {
        max: 4,
        hold: 60,
      },
      animate: true,
      isEnemy: true,
      name: 'Sir Siegfried Schwein',
      type: 'Normal',
      attacks: [attacks.Tackle],
    },
  };

  // Select Screen and context of screen
  const screen =  document.querySelector('canvas');
  const context =  screen.getContext('2d');

  // Set resolution
  screen.width = 1024;
  screen.height = 576;

  // Get modal of battleminigame
  const minigameModal =  document.querySelector('#modal');

  // Initialize Classes for Sprite and its child class Monster 
  class Sprite {
    constructor({
                  position,
                  image,
                  frames = {max: 1, hold: 20},
                  sprites,
                  animate = false,
                  rotation = 0,
                }) {
      this.position = position;
      this.image = image;
      this.frames = {...frames, val: 0, elapsed: 0};
      this.image.onload = () => {
        this.width = this.image.width / this.frames.max;
        this.height = this.image.height;
      };
      this.animate = animate;
      this.sprites = sprites;
      this.opacity = 1;
      this.rotation = rotation;

    }
    // The Draw function needs context to be known before it can be initialized
    draw() {
      context.save();
      context.translate(this.position.x + this.width / 2,
          this.position.y + this.height / 2);
      context.rotate(this.rotation);
      context.translate(-this.position.x - this.width / 2,
          -this.position.y - this.height / 2);
      context.globalAlpha = this.opacity;
      context.drawImage(
          this.image,
          this.frames.val * this.width,
          0,
          this.image.width / this.frames.max,
          this.image.height,
          this.position.x,
          this.position.y,
          this.image.width / this.frames.max,
          this.image.height,
      );
      context.restore();

      if (!this.animate) return;

      if (this.frames.max > 1) {
        this.frames.elapsed++;
      }

      if (this.frames.elapsed % this.frames.hold === 0) {
        if (this.frames.val < this.frames.max - 1) {
          this.frames.val++;
        } else {
          this.frames.val = 0;
        }
      }
    }
  }
  // Child class Monster needs monsters and attacks to be initialized before this
  class Monster extends Sprite {
    constructor({
                  isEnemy = false,
                  name,
                  attacks,
                  type,
                  position,
                  image,
                  frames = {max: 1, hold: 20},
                  sprites,
                  animate = false,
                  rotation = 0,
                }) {
      super({
        position,
        image,
        frames,
        sprites,
        animate,
        rotation,
      });
      this.health = 100;
      this.name = name;
      this.isEnemy = isEnemy;
      this.attacks = attacks;
      this.type = type;
    }

    faint() {
      audio.Battle.stop();
      const dialogBoxElement = document.querySelector('#dialogueBox');
      dialogBoxElement.innerHTML = this.name + ' fainted!';
      gsap.to(this.position, {
        y: this.position.y + 20,
      });
      gsap.to(this, {
        opacity: 0,
      });
    }
    // Attack method for animating and calculating battle damage
    attack({attack, recipient, renderedSprites}) {
      const dialogBoxElement = document.querySelector('#dialogueBox');
      dialogBoxElement.style.display = 'block';

      let rotation = 1;
      if (this.isEnemy) rotation = -2.14;

      let healthBar = '#playerHealthBar';
      if (this.isEnemy) healthBar = '#enemyHealthBar';

      // Create an array and chart to handle effectiveness
      const typesArray = ["Normal", "Fire", "Ice", "Electric"]
      const typeChart = [
          [1, 1, 1, 0.5], // Normal
          [1, 0.5, 2, 1], // Fire
          [1, 2, 0.5, 1], // Ice
          [2, 1, 1, 0.5], //Electric
      ]

      function getEffectiveness(attackerType, recipientType) {
        const attackerIndex = typesArray.indexOf(attackerType.toString())
        const defenderIndex = typesArray.indexOf(recipientType.toString())
        return typeChart[attackerIndex][defenderIndex]
      }
      // log the effectiveness factor
      console.log(`${getEffectiveness(attack.type, recipient.type)}`)
      let effectivenessFactor = getEffectiveness(attack.type, recipient.type)

      function calculateBattleDamage(attackDamage, effectivenessFactor) {
          const A = attackDamage
          const EF = effectivenessFactor

          // Calculate Crit   1/10 Chance
          let C = 1
          if (Math.ceil(Math.random() * 10) === 1) C = 2;
          else C = 1;

          // Random Factor
          const R = (Math.ceil(Math.random() * 38 + 217)) / 255

          const D = ((((((2 * C)/5)+2) * A)/5) + 8) * R * EF
          const returnArray = [D, C]
          return returnArray
      }

      function handleBattleDialog(attackerName, attackName, C, EF) {
        let text = `${attackerName} used ${attackName}`
        if (C === 2) text += `, Critical Hit!!!`;
        if (EF === 2) text += `, It was Super Effective!`;
        else if (EF === 0.5) text += `, It was Ineffective!`;
        dialogBoxElement.innerHTML = text
      }

      let dealedDamage = calculateBattleDamage(attack.damage, effectivenessFactor)[0]
      let Critical = calculateBattleDamage(attack.damage, effectivenessFactor)[1]
      recipient.health -= dealedDamage
      handleBattleDialog(this.name, attack.name, Critical, effectivenessFactor)

      switch (attack.name) {
        case 'Tackle':
          const tl = gsap.timeline();
          let movementDistance = 20;
          if (this.isEnemy) movementDistance = -20;

          tl.to(this.position, {
            x: this.position.x - movementDistance,
          }).to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // Enemy Gets hit
              gsap.to(healthBar, {
                width: recipient.health + '%',
              });

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,

              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          }).to(this.position, {
            x: this.position.x,
          });
          break;
        case 'Fireball':

          const fireballImage = new Image();
          fireballImage.src = 'BattleMinigame/BattleMinigameData/fireball.png';
          const fireball = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y,
            },
            image: fireballImage,
            frames: {
              max: 4,
              hold: 10,
            },
            animate: true,
            rotation,
          });
          renderedSprites.splice(1, 0, fireball);

          gsap.to(fireball.position, {
            x: recipient.position.x,
            y: recipient.position.y,
            onComplete: () => {
              // Enemy Gets hit
              gsap.to(healthBar, {
                width: recipient.health + '%',
              });

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,

              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
              renderedSprites.splice(1, 1);
            },
          });
          break;
        case 'IceShard':
          const iceshardImage = new Image();
          iceshardImage.src = 'BattleMinigame/BattleMinigameData/IceShatter_96x96.png';
          const iceshard = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y,
            },
            image: iceshardImage,
            frames: {
              max: 49,
              hold: 10,
            },
            animate: true,
            rotation,
          });
          renderedSprites.splice(1, 0, iceshard);

          gsap.to(iceshard.position, {
            x: recipient.position.x,
            y: recipient.position.y,
            onComplete: () => {
              // Enemy Gets hit
              gsap.to(healthBar, {
                width: recipient.health + '%',
              });

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,

              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
              renderedSprites.splice(1, 1);
            },
          });
          break;
        case 'ThunderStrike':
          const thunderImage = new Image();
          thunderImage.src = 'BattleMinigame/BattleMinigameData/HolyExplosion_96x96.png';
          const thunder = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y,
            },
            image: thunderImage,
            frames: {
              max: 28,
              hold: 10,
            },
            animate: true,
            rotation,
          });
          renderedSprites.splice(1, 0, thunder);

          gsap.to(thunder.position, {
            x: recipient.position.x,
            y: recipient.position.y,
            onComplete: () => {
              // Enemy Gets hit
              gsap.to(healthBar, {
                width: recipient.health + '%',
              });

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,

              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
              renderedSprites.splice(1, 1);
            },
          });
          break;
        default:
          break;
      }
    }
  }

  // Load Battle background image
  const battleBackgroundImage =  new Image();
  battleBackgroundImage.src = 'BattleMinigame/BattleMinigameData/FinalFightBackground.jpg';

  // Create new battlebackground sprite
  const battleBackground =  new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    image: battleBackgroundImage,
  });
  
  // Create new Monster instance depenging on the current weather
  let draggle
  function getEnemy(weather) {
    switch (weather) {
      case '20DEG':
        draggle = new Monster(monsters.Knight);
        break;
      case '0DEG':
        draggle = new Monster(monsters.Draggle);
        break;
    }

    return draggle;
  }

  draggle = getEnemy('20DEG');
  
  // Emby is always the player
  const emby =  new Monster(monsters.Emby);

  // List of sprites excluding the background to draw
  const renderedSprites = [draggle, emby];

  // Create a button for each player's attacks
   emby.attacks.forEach(attack => {
    const button = document.createElement('button');
    button.innerHTML = attack.name;
    document.querySelector('#attacksBox').append(button);
  });

  // Animate (Render) images onto the canvas using AnimationFrame
  function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach((sprite) => {
      sprite.draw();
    });
  }

  animateBattle();

  // Queue array for "queueing" all that happens in game, depending on input
  const queue = [];
  
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
          draggle.faint();
        });
        // After fainting push an animation event (gsap.to) to the queue
        queue.push(() => {
          gsap.to('#overlappingDiv', {
            opacity: 1,
            // On animation completion disable the display of minigameModal
            onComplete: () => {
              minigameModal.style.display = 'none';
            },
          });
        });
        return;
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
            emby.faint();
          });
          // After the enemy.faint method push an animation event to the queue
          queue.push(() => {
            gsap.to('#overlappingDiv', {
              opacity: 1,
              // On completion of the animation disable the minigameModal display
              onComplete: () => {
                minigameModal.style.display = 'none';
              },
            });
          });
          return;
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

  // Get the healthbar elements
  const healthbar1NameElement =  document.querySelector('#healthBar1Name'); // Enemy
  const healthbar2NameElement =  document.querySelector('#healthBar2Name'); // Player
  // Set the name element of the healthbars to its name
  healthbar1NameElement.innerHTML =  draggle.name;
  healthbar2NameElement.innerHTML =  emby.name;

  // Start the audio once when player has clicked anywhere on the window
  let clicked = false;
   addEventListener('click', () => {
    if (!clicked) {
      audio.Battle.play();
      clicked = true;
    }
  });

}

// Handling for initializing battle.
// shows the modal in which the battle resides
// Currently it only activates the battle once.
let clickedOn = false;
window.addEventListener('click', () => {
  if (clickedOn === false) {
    const minigameModal = document.querySelector('#modal');
    minigameModal.style.display = 'block';
    initializeBattle();
    clickedOn = true;
  } else {
    console.log(clickedOn)
  }
});