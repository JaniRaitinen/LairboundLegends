'use strict';
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
      this.image = new Image();
      this.frames = {...frames, val: 0, elapsed: 0};
      this.image.onload = () => {
        this.width = this.image.width / this.frames.max;
        this.height = this.image.height;
      };
      this.image.src = image.src
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
                  health,
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
      this.health = health;
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

    resetPosition() {
      if (this.isEnemy) {
        this.position.y -= 20
      }
      else return
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

      function calculateBattleDamage(A, EF) {
          // Calculate Crit   1/10 Chance
          let C
          if (Math.ceil(Math.random() * 10) === 1) C = 2;
          else C = 1;

          // Random Factor
          const R = (Math.ceil(Math.random() * 38 + 217)) / 255

          const D = ((((((2 * C)/5)+2) * A)/5) + 8) * R * EF
          return [D, C]
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
      attack.sound.play()
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
        case 'FireArrow':
          const arrowImage = new Image();
          arrowImage.src = 'BattleMinigame/BattleMinigameData/fireball.png';
          const arrow = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y,
            },
            image: arrowImage,
            frames: {
              max: 4,
              hold: 10,
            },
            animate: true,
            rotation,
          });
          renderedSprites.splice(1, 0, arrow);

          gsap.to(arrow.position, {
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