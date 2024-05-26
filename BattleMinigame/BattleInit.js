// Select Screen and context of screen
  const screen =  document.querySelector('canvas');
  const context =  screen.getContext('2d');

  // Set resolution
  screen.width = 1024;
  screen.height = 576;

  // Get modal of battleminigame
  const minigameModal =  document.querySelector('#battleMinigameModal');
  minigameModal.style.display = 'none';
