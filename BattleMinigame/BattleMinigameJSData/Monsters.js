const monsters = {
    Emby: {
      position: {
        x: 100,
        y: 280,
      },
      image: {
        src: 'BattleMinigame/BattleMinigameData/PlayerDragonSprite.png'
      },
      frames: {
        max: 4,
        hold: 60,
      },
      animate: true,
      health: 100,
      name: "Player Dragon",
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
        y: 320,
      },
      image: {src: 'BattleMinigame/BattleMinigameData/YoungIceDragonSprite.png'},
      frames: {
        max: 4,
        hold: 60,
      },
      animate: true,
      health: 75,
      isEnemy: true,
      name: 'Young Ice Dragon',
      type: 'Ice',
      attacks: [attacks.Tackle, attacks.IceShard],
    },
    Knight: {
      position: {
        x: 730,
        y: 330,
      },
      image: {src: 'BattleMinigame/BattleMinigameData/knightSprite.png'},
      frames: {
        max: 4,
        hold: 60,
      },
      animate: true,
      health: 80,
      isEnemy: true,
      name: 'Sir Siegfried Schwein',
      type: 'Normal',
      attacks: [attacks.Tackle],
    },
    Goblin: {
      position: {
        x: 730,
        y: 330,
      },
      image: {src: 'BattleMinigame/BattleMinigameData/goblinSprite.png'},
      frames: {
        max: 4,
        hold: 60,
      },
      animate: true,
      health: 30,
      isEnemy: true,
      name: 'Humpy Dumpy The Snot Chief',
      type: 'Normal',
      attacks: [attacks.Tackle, attacks.FireArrow],
    },
    IceGolem: {
      position: {
        x: 730,
        y: 220,
      },
      image: {src: 'BattleMinigame/BattleMinigameData/iceGolemSprite.png'},
      frames: {
        max: 4,
        hold: 60,
      },
      animate: true,
      health: 100,
      isEnemy: true,
      name: 'Golem of Frost',
      type: 'Ice',
      attacks: [attacks.Tackle, attacks.IceShard],
    }
  }