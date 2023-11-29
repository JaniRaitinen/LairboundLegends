const embyImage = new Image()
embyImage.src = "BattleMinigame/BattleMinigameData/PlayerDragonSprite.png"

const draggleImage = new Image()
draggleImage.src = "BattleMinigame/BattleMinigameData/YoungIceDragonSprite.png"

const monsters = {
  Emby: {
       position: {
        x: 100,
        y: 280
    },
    image: embyImage,
    frames: {
        max: 4,
        hold: 60
    },
    animate: true,
    name: 'Player Dragon Name',
    type: 'Fire',
    attacks: [attacks.Tackle, attacks.Fireball, attacks.IceShard, attacks.ThunderStrike]
  },
  Draggle: {
        position: {
        x: 730,
        y: 300
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 60
    },
    animate: true,
    isEnemy: true,
    name: 'Young Ice Dragon',
    type: 'Ice',
    attacks: [attacks.Tackle, attacks.IceShard]
  }
}