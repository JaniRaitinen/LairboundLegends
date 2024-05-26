'use strict';

  function getBackgroundImage(weatherCondition) {
    switch (weatherCondition) {
      case '-20DEG':
        return '../BattleMinigame/BattleMinigameData/FinalFightBackground.jpg'
      break
      case '-10DEG':
        return '../BattleMinigame/BattleMinigameData/FinalFightBackground.jpg'
      break
      case '0DEG':
        return '../BattleMinigame/BattleMinigameData/FinalFightBackground.jpg'
        break;
      case '10DEG':
        return '../BattleMinigame/BattleMinigameData/FinalFightBackground.jpg'
        break;
      case '20DEG':
        return '../BattleMinigame/BattleMinigameData/FinalFightBackground.jpg'
        break;
    }
  }
  function getEnemy(weather) {
    switch (weather) {
      case '10DEG':
        return new Monster(monsters.Knight);
        break;
      case '0DEG':
        return new Monster(monsters.Draggle);
        break;
      case '20DEG':
        return new Monster(monsters.Goblin);
        break;
      case '-10DEG':
        return new Monster(monsters.Knight);
        break
      case '-20DEG':
        return new Monster(monsters.IceGolem);
        break
      default:
        break
    }
  }