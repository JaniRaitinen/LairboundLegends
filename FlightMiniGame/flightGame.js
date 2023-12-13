'use strict';

//lennettävän matkan muuttujat
let distance = 1000; //tähän lennettävän matkan arvo!
let stamina = 2000; //tähän pelaajan stamina!

//nappaa peliruudun canvaksen ja stamina ja health -mittarit,
//sekä määrittää canvaksen koon
const canvas = document.querySelector('#flightGame');
const c = canvas.getContext('2d');
let distanceMeter = document.querySelector('#distance')
let staminaMeter = document.querySelector('#stamina')

canvas.width = 576;
canvas.height = 720;

//tekee collision-tiedoista listan per rivi
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 36) {
  collisionsMap.push(collisions.slice(i, 36 + i))
}

//vakiosuhde, jolla 2048 pikseliä korkeat kuvat saa alkamaan vasemmasta alareunasta
const offset = {
  x: 0,
  y: -1328,
};

//luo rajat ja collision mapin
const boundaries = []
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 657)
    boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width,
            y: i * Boundary.height
          }
    })
    )
  })
})

//lataa käytettävät kuvat muuttujaksi
const image = new Image();
image.src = 'img/testGroundMap.png';
const cloudImage = new Image();
cloudImage.src = 'img/testCloudMap.png'
const playerImage = new Image();
playerImage.src = 'img/animatedDragon.png'

//luo kuvista Sprite-luokan oliot
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});
const clouds = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: cloudImage,
});
const player = new Sprite({
    position: {
      x: canvas.width / 2 - playerImage.width / 4 / 2,
      y: canvas.height - canvas.height / 5,
},
  image: playerImage,
  frames: {max: 4},
});

//liikkumisnäppäinten perustila: kun liikutaan, tämä muutetaan trueksi
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

//collision -funktio
function rectangularCollision({rectangle1, rectangle2}) {
  return (
      rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
      rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
      rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
      rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}
//käynnistettävä funktio, joka sisältää kuvien piirron kerrosjärjestyksessä sekä animoinnin ja liikkumisen
function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  clouds.draw();
  boundaries.forEach(boundary => {
    boundary.draw()
  })
  player.draw();

  let moving = true
  if (keys.a.pressed && lastKey === 'a') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: {
        ...boundary,
        position : {
        x: boundary.position.x + 3,
        y: boundary.position.y
        }
      }
    })
) {
        moving = false
        break
      }
    }

    if (moving)
    player.position.x -= 5
  } else if (keys.d.pressed && lastKey === 'd') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: {
        ...boundary,
        position : {
        x: boundary.position.x - 3,
        y: boundary.position.y
        }
      }
    })
) {
        moving = false
        break
      }
    }

    if (moving)
    player.position.x += 5
  }

  //taustakuvan scrollausanimaatio. looppaus on toteutettu niin, että rullattavan
  //kuvan viimeinen ja ensimmäinen ruutu ovat identtiset.
  function moveBackground() {
    background.position.y += 0.4;
    if (background.position.y >= 0) {
      background.position.y = offset.y;
      requestAnimationFrame(moveBackground);
    }
  }

  //position.x on pilvien sivusuunta-animaatio, position.y vertikaali-.
  //if-lauseen luku hallitsee animaation resetointikohtaa. katsottu silmämääräisesti
  //mahdollisimman saumattomaksi: mitä lähempänä nollaa, sitä myöhemmin resetointi tapahtuu.
  function moveClouds() {
    clouds.position.x -= 0.08735;
    clouds.position.y += 1.2;
    if (clouds.position.y >= -15.75) {
      clouds.position.x = offset.x;
      clouds.position.y = offset.y;
      requestAnimationFrame(moveClouds);
    }
  }

  moveBackground();
  moveClouds();
}

function depleteStamina() {
  setTimeout(depleteStamina, 250)
  if (distance > 0) {
    distance--
    distanceMeter.innerText = `Distance: ${distance}`
  }
  if (stamina > 0) {
    stamina--
    staminaMeter.innerText = `Stamina: ${stamina}`
  }
}

animate();
depleteStamina();

//event listenerit, jotka vahtivat a- ja d-näppäinten painamista
let lastKey = '';
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
});