'use strict';

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
const statusButton = document.getElementsByClassName('status-button')
const lairButton = document.getElementsByClassName('lair-button')
const aboutButton = document.getElementsByClassName('about-button')
const closeButton = document.getElementsByClassName('close-button')

// Taverna
const modal = document.querySelector('dialog')
const tavernButton = document.getElementById('tavern-picture')
const span = document.querySelector('span')
const healthPotion = document.getElementById('hp-potion');
const staminaPotion = document.getElementById('stamina-potion');
const prophecy = document.getElementById('prophecy')
const oracle = document.getElementById('oracle');