const outdoorImage = document.getElementById('outdoor');
const indoorImage = document.getElementById('indoor');

const buttonStop = document.getElementById("pause-indoor");
const buttonInstant = document.getElementById("instant-indoor");
const buttonLive = document.getElementById("live-indoor");

const buttonStopOutdoor = document.getElementById("pause-outdoor");
const buttonLiveOutdoor = document.getElementById("live-outdoor");

let rateID;
let rateOutdoorID;


// const indoorConnection = document.getElementById("indoor-connection");
// indoorConnection.style.display = 'none';

// const outdoorConnection = document.getElementById("outdoor-connection");
// outdoorConnection.style.display = 'none';


// on load
$(document).ready(() => { buttonLive.click() });
$(document).ready(() => { buttonLiveOutdoor.click() });
$(document).ready(() => { outdoorImage.src = "http://allsky.physics.umanitoba.ca/outdoor.png?"+ new Date().getTime(); });
$(document).ready(() => { indoorImage.src = "http://allsky.physics.umanitoba.ca/indoor.png?"+ new Date().getTime(); });


indoorImage.onerror = imageNotFoundIndoor;
outdoorImage.onerror = imageNotFoundOutdoor;



function imageNotFoundIndoor() {

    indoorImage.src = "/nosignal.png"; 
    updateImageIndoor();
}
function imageNotFoundOutdoor() {
    
    
    indoorImage.src = "/nosignal.png";
    updateImageIndoor();
}




function updateImageIndoor() {
    // $('#indoor').attr('src', 'http://allsky.physics.umanitoba.ca/indoor.png?' + new Date().getTime());
    indoorImage.src = "http://allsky.physics.umanitoba.ca/indoor.png?"+ new Date().getTime();        
}

function updateImageOutdoor() {
    // $('#indoor').attr('src', 'http://allsky.physics.umanitoba.ca/indoor.png?' + new Date().getTime());
    outdoorImage.src = "http://allsky.physics.umanitoba.ca/outdoor.png?"+ new Date().getTime();
}


/**
 * Indoor image buttons
 */
buttonStop.addEventListener('click', () => {
    clearInterval(rateID);
    rateID = null;
    resetColourIndoor();
    buttonStop.style.background = "lightgray";
});
buttonInstant.addEventListener('click', () => {
    clearInterval(rateID);
    rateID = setInterval(updateImageIndoor, 2000);
    resetColourIndoor();
    buttonInstant.style.background = "lightgray";
});
buttonLive.addEventListener('click', () => {
    clearInterval(rateID);
    rateID = setInterval(updateImageIndoor, 10000);
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





function resetColourIndoor() {

    buttonStop.style.background = "none";
    buttonInstant.style.background = "none";
    buttonLive.style.background = "none";
}

function resetColourOutdoor() {

    buttonStopOutdoor.style.background = "none";
    buttonLiveOutdoor.style.background = "none";
}