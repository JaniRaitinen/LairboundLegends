'use strict';

// Backend retrieval function
async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Invalid server input!')
    const data = await response.json();
      return data
  } catch (error) {
    console.log('Error loading data:', error)
  }
}

// Fetch text data from specific index
async function fetchTextDataAtIndex(textId, index) {
  const textData = await getData(`${apiUrl}fetchTextAtIndex?name=${playerName}&playerLocation=${playerLocation}&textId=${textId}&index=${index}`)
  return textData
}
