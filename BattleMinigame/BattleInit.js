
const screen = document.querySelector('canvas');
const context = screen.getContext('2d');


// Aseta screen resolution Ja piirrä canvas
screen.width = 1024;
screen.height = 576;

const minigameModal = document.querySelector('#modal')

window.addEventListener('click', () => {
    minigameModal.style.display = 'block'
})


