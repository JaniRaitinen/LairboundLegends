
/* Funktioilla soitetaan musaa. Status = 'play' soittaa, ja status = 'stop' lopettaa.
   SFX soitetaan esim. sfx.fireball.play();
*/


function menuMusic(status) {
  Howler.stop()
    if(status === 'play') {
         let music1 = new Howl({
            src: ['Sound/menu-loop.wav'],
            autoplay: false,
            loop: true,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Intro finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['Sound/menu-intro.wav'],
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
            src: ['Sound/flight-loop.wav'],
            autoplay: false,
            loop: true,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Intro finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['Sound/flight-intro.wav'],
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
            src: ['Sound/battle-loop.wav'],
            autoplay: false,
            loop: true,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Intro finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['Sound/battle-intro.wav'],
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
            src: ['Sound/map-loop.wav'],
            autoplay: false,
            loop: true,
            //volume: (musicVol / 100),
            onend: function() {
                console.log("Intro finished!") //For debugging
            }
        });
        let music = new Howl({
            src: ['Sound/map-loop.wav'],
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
    src: 'Sound/hover.mp3'
  }),
  open: new Howl({
    src: 'Sound/open.mp3'
  }),
  close: new Howl({
    src: 'Sound/close.mp3'
  }),
  attack: new Howl({
    src: 'Sound/attack.mp3'
  }),
  fireball: new Howl({
    src: 'Sound/fireball.mp3'
  }),
  potion: new Howl({
    src: 'Sound/potion.mp3'
  }),
  start: new Howl({
    src: 'Sound/start.mp3'
  }),
  victory: new Howl({
    src: 'Sound/victory.wav'
  }),
  lose: new Howl({
    src: 'Sound/lose.wav'
  }),
  magic: new Howl({
    src: 'Sound/magic.wav'
  }),
  water: new Howl({
    src: 'Sound/water.wav'
  }),
  hploss: new Howl({
    src: 'Sound/hploss.wav'
  }),
  hammer: new Howl({
    src: 'Sound/hammer.wav'
  }),
  sword: new Howl({
    src: 'Sound/sword.wav'
  }),
  thunder: new Howl({
    src: 'Sound/thunder.wav'
  }),
  ice: new Howl({
    src: 'Sound/ice.wav'
  }),
  slash: new Howl({
    src: 'Sound/slash.wav'
  }),
  whoosh: new Howl({
    src: 'Sound/whoosh.wav'
  })
}