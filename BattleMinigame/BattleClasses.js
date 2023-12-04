'use strict';


class Sprite {
    constructor({
                  position,
                  image,
                  frames = { max: 1, hold: 20},
                  sprites,
                  animate=false,
                  rotation = 0
    }) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation

    }

    draw() {
      context.save()
      context.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
      context.rotate(this.rotation)
      context.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
      context.globalAlpha = this.opacity
      // context.drawImage(this.image, this.position.x, this.position.y);
      context.drawImage(
          this.image,
          this.frames.val * this.width,
          0,
          this.image.width / this.frames.max,
          this.image.height,
          this.position.x,
          this.position.y,
          this.image.width / this.frames.max,
          this.image.height
      )
      context.restore()

      if (!this.animate) return; // Katsotaan onko Sprite liikkuva, elikkä pitääkö se animoida.

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

class Monster extends Sprite {
  constructor({
                isEnemy=false,
                name,
                attacks,
                type,
                position,
                image,
                frames = { max: 1, hold: 20},
                sprites,
                animate=false,
                rotation = 0,
  }) {
      super({
        position,
        image,
        frames,
        sprites,
        animate,
        rotation
      })
      this.health = 100
      this.name = name
      this.isEnemy = isEnemy
      this.attacks = attacks
      this.type = type
  }

  faint() {
    audio.Battle.stop()
    const dialogBoxElement = document.querySelector('#dialogueBox');
    dialogBoxElement.innerHTML = this.name + ' fainted!'
    gsap.to(this.position, {
      y: this.position.y + 20
    })
    gsap.to(this, {
      opacity: 0
    })
  }

  attack({attack, recipient, renderedSprites}) {
    const dialogBoxElement = document.querySelector('#dialogueBox');
    dialogBoxElement.style.display = 'block'

    let rotation = 1
    if (this.isEnemy) rotation = -2.14

    let healthBar = "#playerHealthBar"
    if (this.isEnemy) healthBar = "#enemyHealthBar"

    // Check Effective Types
    let effectiveTypes = ""
    let ineffectiveTypes = ""
    switch (attack.type) {
      case 'Normal':
        effectiveTypes = ""
        ineffectiveTypes = ""
        break;
      case 'Fire':
        effectiveTypes = "Ice"
        ineffectiveTypes = "Ice"
        break;
      case 'Ice':
        effectiveTypes = "Fire"
        ineffectiveTypes = "Ice"
        break;
      case 'Electric':
        effectiveTypes = "Normal"
        ineffectiveTypes = 'Electric'
        break;
    }

    if (effectiveTypes === recipient.type) {
      // Effective attack
      recipient.health -= attack.damage * Math.ceil(Math.random() * 2)
      dialogBoxElement.innerHTML = this.name + ' used ' + attack.name + ', It was super effective!'
    }
    else if (ineffectiveTypes === recipient.type) {
      // Innefective attack
      recipient.health -= (attack.damage * Math.random() + 1)
      dialogBoxElement.innerHTML = this.name + ' used ' + attack.name + ', It was not effective!'
    }
    else {
      // Normal Attack
      recipient.health -= attack.damage
      dialogBoxElement.innerHTML = this.name + ' used ' + attack.name
    }
    recipient.health -= attack.damage
    switch (attack.name) {
      case 'Tackle':
        const tl = gsap.timeline()
        let movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        tl.to(this.position, {
          x: this.position.x - movementDistance
        }).to(this.position, {
          x: this.position.x + movementDistance * 2,
          duration: 0.1,
          onComplete: () => {
            // Enemy Gets hit
            gsap.to(healthBar, {
              width: recipient.health + '%'
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,

            })
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
          }
        }).to(this.position, {
          x: this.position.x
        })
        break;
      case 'Fireball':

        const fireballImage = new Image()
        fireballImage.src = 'BattleMinigame/BattleMinigameData/fireball.png'
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10
          },
          animate: true,
          rotation
        })
        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Enemy Gets hit
            gsap.to(healthBar, {
              width: recipient.health + '%'
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,

            })
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
            renderedSprites.splice(1, 1)
          }
        })
        break;
      case "IceShard":
        const iceshardImage = new Image()
        iceshardImage.src = 'BattleMinigame/BattleMinigameData/IceShatter_96x96.png'
        const iceshard = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          image: iceshardImage,
          frames: {
            max: 49,
            hold: 10
          },
          animate: true,
          rotation
        })
        renderedSprites.splice(1, 0, iceshard)

        gsap.to(iceshard.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Enemy Gets hit
            gsap.to(healthBar, {
              width: recipient.health + '%'
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,

            })
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
            renderedSprites.splice(1, 1)
          }
        })
        break;
      case "ThunderStrike":
        const thunderImage = new Image()
        thunderImage.src = 'BattleMinigame/BattleMinigameData/HolyExplosion_96x96.png'
        const thunder = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          image: thunderImage,
          frames: {
            max: 28,
            hold: 10
          },
          animate: true,
          rotation
        })
        renderedSprites.splice(1, 0, thunder)

        gsap.to(thunder.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Enemy Gets hit
            gsap.to(healthBar, {
              width: recipient.health + '%'
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,

            })
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
            renderedSprites.splice(1, 1)
          }
        })
        break;
      case "":
        break
    }
  }
}