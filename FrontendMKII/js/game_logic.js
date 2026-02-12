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
