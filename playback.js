const outdoorImage = document.getElementById('outdoor');
const indoorImage = document.getElementById('indoor');

const buttonStop = document.getElementById("pause-indoor");
const buttonInstant = document.getElementById("instant-indoor");
const buttonLive = document.getElementById("live-indoor");

const buttonStopOutdoor = document.getElementById("pause-outdoor");
const buttonLiveOutdoor = document.getElementById("live-outdoor");

// refresh setInterval() identifier
let rateIndoorID;
let rateOutdoorID;

// function to call on error
indoorImage.onerror = imageNotFoundIndoor;
outdoorImage.onerror = imageNotFoundOutdoor;


/**
 * On page load
 */
$(document).ready(() => { buttonLive.click() });
$(document).ready(() => { buttonLiveOutdoor.click() });
$(document).ready(() => { outdoorImage.src = "http://allsky.physics.umanitoba.ca/outdoor.png?"+ new Date().getTime(); });
$(document).ready(() => { indoorImage.src = "http://allsky.physics.umanitoba.ca/indoor.png?"+ new Date().getTime(); });

/**
 * Handle image source error
 */
function imageNotFoundIndoor() {
    indoorImage.src = "/nosignal.png"; 
}
function imageNotFoundOutdoor() {
    outdoorImage.src = "/nosignal.png";
}


/**
 * Update image source
 */
function updateImageIndoor() {
    indoorImage.src = "http://allsky.physics.umanitoba.ca/indoor.png?"+ new Date().getTime();        
}
function updateImageOutdoor() {
    outdoorImage.src = "http://allsky.physics.umanitoba.ca/outdoor.png?"+ new Date().getTime();
}


/**
 * Indoor image buttons
 */
buttonStop.addEventListener('click', () => {
    clearInterval(rateIndoorID);
    rateIndoorID = null;
    resetColourIndoor();
    buttonStop.style.background = "lightgray";
});
buttonInstant.addEventListener('click', () => {
    clearInterval(rateIndoorID);
    rateIndoorID = setInterval(updateImageIndoor, 2000);
    resetColourIndoor();
    buttonInstant.style.background = "lightgray";
});
buttonLive.addEventListener('click', () => {
    clearInterval(rateIndoorID);
    rateIndoorID = setInterval(updateImageIndoor, 10000);
    resetColourIndoor();
    buttonLive.style.background = "lightgray";
});


/**
 * Outdoor image buttons
 */
buttonStopOutdoor.addEventListener('click', () => {
    clearInterval(rateOutdoorID);
    rateOutdoorID = null;
    resetColourOutdoor();
    buttonStopOutdoor.style.background = "lightgray";
});
buttonLiveOutdoor.addEventListener('click', () => {
    clearInterval(rateOutdoorID);
    rateOutdoorID = setInterval(updateImageOutdoor, 10000);
    resetColourOutdoor();
    buttonLiveOutdoor.style.background = "lightgray";
});


/**
 * Button selection visuals
 */
function resetColourIndoor() {

    buttonStop.style.background = "none";
    buttonInstant.style.background = "none";
    buttonLive.style.background = "none";
}
function resetColourOutdoor() {
    buttonStopOutdoor.style.background = "none";
    buttonLiveOutdoor.style.background = "none";
}