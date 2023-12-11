
/* Funktioilla soitetaan musaa. Status = 'play' soittaa, ja status = 'stop' lopettaa.
   SFX soitetaan esim. sfx.fireball.play();
*/


function menuMusic(status) {
  Howler.stop()
    if(status === 'play') {
         let music1 = new Howl({
            src: ['sound/menu-loop.wav'],
            autoplay: false,
            loop: true,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Intro finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['sound/menu-intro.wav'],
            autoplay: true,
            loop: false,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Loop finished!") //For debugging
                //let TEMP = music1
                music1 = music
                //music = TEMP //I had to add this because of a volume slider
                music.play()
            }
        });
    } else if (status === 'stop'){
      Howler.stop()
    }
}


function flightMusic(status) {
  Howler.stop()
    if(status === 'play') {
         let music1 = new Howl({
            src: ['sound/flight-loop.wav'],
            autoplay: false,
            loop: true,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Intro finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['sound/flight-intro.wav'],
            autoplay: true,
            loop: false,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Loop finished!") //For debugging
                //let TEMP = music1
                music1 = music
                //music = TEMP //I had to add this because of a volume slider
                music.play()
            }
        });
    } else if (status === 'stop'){
      Howler.stop()
    }
}


function battleMusic(status) {
  Howler.stop()
    if(status === 'play') {
         let music1 = new Howl({
            src: ['sound/battle-loop.wav'],
            autoplay: false,
            loop: true,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Intro finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['sound/battle-intro.wav'],
            autoplay: true,
            loop: false,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Loop finished!") //For debugging
                //let TEMP = music1
                music1 = music
                //music = TEMP //I had to add this because of a volume slider
                music.play()
            }
        });
    } else if (status === 'stop'){
      Howler.stop()
    }
}


function mapMusic(status) {
  Howler.stop()
    if(status === 'play') {
         let music1 = new Howl({
            src: ['sound/map-loop.wav'],
            autoplay: false,
            loop: true,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Intro finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['sound/map-loop.wav'],
            autoplay: true,
            loop: false,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Loop finished!") //For debugging
                //let TEMP = music1
                music1 = music
                //music = TEMP //I had to add this because of a volume slider
                music.play()
            }
        });
    } else if (status === 'stop'){
      Howler.stop()
    }
}


const sfx = {
  hover: new Howl({
    src: 'sound/hover.mp3'
  }),
  open: new Howl({
    src: 'sound/open.mp3'
  }),
  close: new Howl({
    src: 'sound/close.mp3'
  }),
  attack: new Howl({
    src: 'sound/attack.mp3'
  }),
  fireball: new Howl({
    src: 'sound/fireball.mp3'
  }),
  potion: new Howl({
    src: 'sound/potion.mp3'
  }),
  start: new Howl({
    src: 'sound/start.mp3'
  }),
  victory: new Howl({
    src: 'sound/victory.wav'
  }),
  lose: new Howl({
    src: 'sound/lose.wav'
  }),
  magic: new Howl({
    src: 'sound/magic.wav'
  }),
  water: new Howl({
    src: 'sound/water.wav'
  }),
  hploss: new Howl({
    src: 'sound/hploss.wav'
  }),
  hammer: new Howl({
    src: 'sound/hammer.wav'
  }),
  sword: new Howl({
    src: 'sound/sword.wav'
  }),
  thunder: new Howl({
    src: 'sound/thunder.wav'
  }),
  ice: new Howl({
    src: 'sound/ice.wav'
  }),
  slash: new Howl({
    src: 'sound/slash.wav'
  }),
  whoosh: new Howl({
    src: 'sound/whoosh.wav'
  })
}