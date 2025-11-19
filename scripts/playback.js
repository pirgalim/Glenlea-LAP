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
$(document).ready(() => { outdoorImage.src = "http://allsky.physics.umanitoba.ca/outdoor.png?" + new Date().getTime(); });
$(document).ready(() => { indoorImage.src = "http://allsky.physics.umanitoba.ca/indoor.png?" + new Date().getTime(); });

/**
 * Handle image source error
 */
function imageNotFoundIndoor() {
    indoorImage.src = "visuals/nosignal.png";

}
function imageNotFoundOutdoor() {
    outdoorImage.src = "visuals/nosignal.png";
}


// var count = 0;
// var drop = 0;
/**
 * Update image source
 */
function updateImageIndoor() {

    const newSrc = "http://allsky.physics.umanitoba.ca/indoor.png?" + new Date().getTime();

    // temp image
    const tempImage = new Image()

    tempImage.onload = function () {
        // update image if successfully loaded
        indoorImage.src = newSrc;
        console.log("Updated image")
    };
    tempImage.onerror = function () {
        console.log(`Failed to load ${newSrc}. Retaining previous image.`);
        // drop++;
    };

    // try updating the temp image src, will result in above function(s) being called
    tempImage.src = newSrc;

    // count++;
    // console.log("Total: ", count)
    // console.log("Dropped: ", drop)
}
function updateImageOutdoor() {

    outdoorImage.src = "http://allsky.physics.umanitoba.ca/outdoor.png?" + new Date().getTime();

    //FIXME: fix frame dropping
}


/**
 * Indoor image buttons
 */
buttonStop.addEventListener('click', () => {
    clearInterval(rateIndoorID);
    rateIndoorID = null;
    resetColourIndoor();
    buttonStop.classList.add('active');
});
buttonInstant.addEventListener('click', () => {
    clearInterval(rateIndoorID);
    rateIndoorID = setInterval(updateImageIndoor, 2000);
    resetColourIndoor();
    buttonInstant.classList.add('active');
});
buttonLive.addEventListener('click', () => {
    clearInterval(rateIndoorID);
    rateIndoorID = setInterval(updateImageIndoor, 10000);
    resetColourIndoor();
    buttonLive.classList.add('active');
});


/**
 * Outdoor image buttons
 */
buttonStopOutdoor.addEventListener('click', () => {
    clearInterval(rateOutdoorID);
    rateOutdoorID = null;
    resetColourOutdoor();
    buttonStopOutdoor.classList.add('active');
});
buttonLiveOutdoor.addEventListener('click', () => {
    clearInterval(rateOutdoorID);
    rateOutdoorID = setInterval(updateImageOutdoor, 10000);
    resetColourOutdoor();
    buttonLiveOutdoor.classList.add('active');
});


/**
 * Button selection visuals
 */
function resetColourIndoor() {
    buttonStop.classList.remove('active');
    buttonInstant.classList.remove('active');
    buttonLive.classList.remove('active');
}
function resetColourOutdoor() {
    buttonStopOutdoor.classList.remove('active');
    buttonLiveOutdoor.classList.remove('active');
}