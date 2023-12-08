'use strict';


// Toiminta jolla avataan Leaflet kartta
const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);


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

