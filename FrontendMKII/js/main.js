'use strict';


// Toiminta jolla avataan Leaflet kartta
const map = L.map('map', {tap: false});
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
	minZoom: 1,
	maxZoom: 16,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
}).addTo(map);
map.setView([60, 24], 7);

//Leafletin ikonit
const locIcon = L.divIcon({
    className: 'loc-icon',
    html: '<img src="img/loc-icon.png" class="loc-icon-image" />,',
    iconAnchor: [27, 0],
    popupAnchor: [0, 0]
});

const destIcon = L.divIcon({
    className: 'dest-icon',
    html: '<img src="img/dest-icon.png" class="dest-icon-image" />',
    iconAnchor: [19, 0],
    popupAnchor: [0, 0]
});

const lairportMarkers = L.featureGroup().addTo(map);

// Funktio jolla vaihdetaan scrollin välilehtiä (status/lair/about)
function changeTab(tabName) {
    // Piilotetaan kaikki välilehdet
    let tabs = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    // Näytetään valittu välilehti
    document.getElementById(tabName + "-tab").style.display = "block";
}

// Leaflet objects
const lairportMarker = L.featureGroup().addTo(map)
const blueIcon = L.divIcon({className: 'blue-icon'})
const greenIcon = L.divIcon({className: 'green-icon'})

// Toiminto jolla avataan scrolli ja dialogi-ikkuna
window.onload = function () {
    // Avataan scrolli ja sen status-väilehti aina kun sivu päivitetään
    document.getElementById("status-tab").style.display = "block";
    // Kutsutaan changeTab-funktiosta status-välilehteä
    changeTab("status");
    // Kutsutaan openDialogue-funktiota
    openDialogue();
};


// Funktio jolla suljetaan dialogi-ikkuna (X)
function closeDialogue() {
    document.querySelector(".dialogue").style.display = "none";
}


// Funktio joka avaa dialogi-ikkunan
function openDialogue() {
    document.querySelector(".dialogue").style.display = "block";
}

