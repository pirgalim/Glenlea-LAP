var TEMP_COLOUR_HOT = '255, 150, 0';
var TEMP_COLOUR_COLD = '180, 180, 255';
var PRECIP_COLOUR = '180, 120, 256';
var CLOUD_COLOUR = '80, 135, 256';
var WIND_COLOUR = '80, 255, 80';

var TEMP_THRESH_HOT = 40;       // °C
var TEMP_THRESH_COLD = -40;     // °C
var PRECIP_THRESH = 100;        // %
var CLOUD_THRESH = 80;          // %
var WIND_THRESH = 30;           // km/h


/**
 * Calls weather api
 * Note: coordinates for Glenlea Astronomical Observatory (49.6451093, -97.1223097)
 * @returns weather data
 */
async function call() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=49.6451093&longitude=-97.1223097&current=temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=America%2FChicago&past_days=1&forecast_days=3');
        const data = await response.json();
        return data;
    } 
    catch (error) {
        div = document.getElementById("error");

        // create and format error message
        text = document.createElement('h3');
        text.textContent = "Forecast is currently unavailable";
        text.style.margin = "0";
        div.appendChild(text);

        // hide weather forecast elements
        document.getElementById("current-conditions").style.display = "none";
        document.getElementById("hourly-conditions").style.display = "none";

        // log exact error to console for debugging purposes
        console.error('Error:', error);
    }
}


/**
 * calls current and hourly functions on successful api call
 */
async function display() {
    const data = await call();
    currentCondtions(data);
    // currentPosition();  // use file sent via sftp?
    hourlyConditions(data);
}



// function currentPosition() {

//     const ra = document.getElementById('ra-label');
//     const dec = document.getElementById('dec-label');
//     const alt = document.getElementById('alt-label');
//     const az = document.getElementById('az-label');
//     const timePos = document.getElementById('timePos-label');

//     text = document.createElement('p');
//     text.textContent = "2h 31m 48.7s";
//     ra.appendChild(text);

//     text = document.createElement('p');
//     text.textContent = "+89° 15′ 51″";
//     dec.appendChild(text);

//     text = document.createElement('p');
//     text.textContent = "0° 51′ 30";
//     alt.appendChild(text);

//     text = document.createElement('p');
//     text.textContent = "49° 30′ 54";
//     az.appendChild(text);

//     text = document.createElement('p');
//     text.textContent = "... this is a demo";
//     timePos.appendChild(text);
// }


/**
 * Formats 'data' and creates elements in specified classes
 * @param {*} data object returned by weather api
 */
function currentCondtions(data) {

    // current condition arrays from main data object
    const current = data["current"];
    const currentUnits = data["current_units"];

    // obtain list of headings that are part of the 'current' class
    const elements = document.getElementsByClassName("current");
    // expected output??
    // console.log(elements);

    const temp = document.getElementById('temp-label');
    const precip = document.getElementById('precip-label');
    const cloud = document.getElementById('cloud-label');
    const wind = document.getElementById('wind-label');
    const timeCond = document.getElementById('timeCond-label');

    // HTML text element
    let text;

    // temperature
    text = document.createElement('p');
    text.textContent = current["temperature_2m"] + currentUnits["temperature_2m"];
    temp.appendChild(text);
    // temp.style.background = 'rgba(' + TEMP_COLOUR_HOT + ',' + current["temperature_2m"]/TEMP_THRESH_HOT + ')';

    // cloud cover
    text = document.createElement('p');
    text.textContent = current["cloud_cover"] + currentUnits["cloud_cover"];
    cloud.appendChild(text);
    // cloud.style.background = 'rgba(' + CLOUD_COLOUR + ',' + current["cloud_cover"]/CLOUD_THRESH + ')';

    // precipitation
    text = document.createElement('p');
    text.textContent = current["precipitation"] + " " + currentUnits["precipitation"];
    precip.appendChild(text);
    // precip.style.background = 'rgba(' + PRECIP_COLOUR + ',' + current["precipitation"]/PRECIP_THRESH + ')';

    // wind speed
    const direction = Number( data["current"]["wind_direction_10m"] );
    text = document.createElement('p');
    text.textContent = current["wind_speed_10m"] + " " + currentUnits["wind_speed_10m"] + " " + windDirection(direction);
    wind.appendChild(text);
    // wind.style.background = 'rgba(' + WIND_COLOUR + ',' + current["wind_speed_10m"]/WIND_THRESH + ')';


    // timestamp from last request
    text = document.createElement('p');
    var time = current["time"].split("T");
    text.textContent = time[0] + " at " + time[1] + " "; // data["timezone_abbreviation"]
    timeCond.appendChild(text);
    // elements[4].appendChild(text);
}


/**
 * Formats 'data' and creates elements in specified classes
 * @param {*} data 
 */
function hourlyConditions(data) {

    // parameters from data
    const hourly = data["hourly"];  
    const hourlyUnits = data["hourly_units"]; 
    const currTime = data["current"]["time"];

    // parameters from hourly
    const times = hourly["time"];

    const clouds = hourly["cloud_cover"];
    const cloudUnits = hourlyUnits["cloud_cover"];

    const precip = hourly["precipitation_probability"];
    const precipUnits = hourlyUnits["precipitation_probability"];

    const temp = hourly["temperature_2m"];
    const tempUnits = hourlyUnits["temperature_2m"];

    const wind = hourly["wind_speed_10m"];
    const windDir = hourly["wind_direction_10m"];

    // convert current time from YYYY-MM-DDTHH:MM to a number representing the current hour
    var currHour = currTime.split("T")[1].split(":")[0];
    // convert current time from YYYY-MM-DDTHH:MM to a number representing the current day
    var currDay = currTime.split("T")[0].split("-")[2];

    // find current time within the hourly array
    var startPosition = 0;
    for(let i = 0; i < times.length; i++) {
        if( times[i].split("T")[1].split(":")[0] == currHour && times[i].split("T")[0].split("-")[2] == currDay) { startPosition = i; }
        times[i] = times[i].split("T")[1];
    }

    // obtain list of headings that are part of the 'block-small' class
    const elements = document.getElementsByClassName("block-hourly");
    // console.log(elements.length);
    
    // append data to each element from 'elements'
    for(let i = 0; i < elements.length; i++) {

        // midnight indicator
        if(times[startPosition + i] == "00:00") {  
            elements[i].style.borderRight = "2px solid red";
        }
        
        addElement(elements, times, startPosition, i, 'rgba(255, 150, 0, ', false, "", "");
    
        // // temperature colour flips after 0
        if(temp[startPosition + i] >= 0) { 
            addElement(elements, temp, startPosition, i, TEMP_COLOUR_HOT, TEMP_THRESH_HOT, false, tempUnits);
        }
        else { 
            addElement(elements, temp, startPosition, i, TEMP_COLOUR_COLD, TEMP_THRESH_COLD, false, tempUnits);
        }
                
        addElement(elements, precip, startPosition, i, PRECIP_COLOUR, PRECIP_THRESH, false, precipUnits);
        addElement(elements, clouds, startPosition, i, CLOUD_COLOUR, CLOUD_THRESH, true, cloudUnits);
        addElement(elements, wind, startPosition, i, WIND_COLOUR, WIND_THRESH, false, windDirection(windDir[i]));

        console.log(wind[i+startPosition], windDir[i]);

    }
}


/**
 * 
 * @param {Array} elements 
 * @param {Array} condition 
 * @param {int} current 
 * @param {int} pos 
 * @param {String} colour 
 * @param {int} threshold 
 * @param {String} units 
 */
function addElement(elements, condition, current, pos, colour, threshold, flip, units) {

    var value = Math.round( condition[current + pos] ) || condition[current + pos];

    div = document.createElement('div');
    div.textContent = value + units;
    elements[pos].appendChild(div);
    div.style.padding = '10px';

    if(Number.isInteger(threshold)) {

        if(flip) {
            var rgba = 'rgba(' + colour + ',' + (1 - value/threshold) + ')';
        }
        else {
            var rgba = 'rgba(' + colour + ',' + (value/threshold + 0.1) + ')';
        }
    }
    else {
        rgba = 'lightgray';
    }
    div.style.background = rgba;
    div.style.borderTop = "1px solid gray";
}


// /**
//  * Adds space between elements
//  * @param {*} elements  array of elements in the DOM
//  * @param {*} i         index of the desired element
//  */
// function addSpace(elements, i) {
//     text = document.createElement('br');
//     elements[i].appendChild(text);
//     text = document.createElement('br');
//     elements[i].appendChild(text);
// }


/**
 * Converts wind direction from degrees to a more readable format
 * @param {*} data      api data object
 * @returns {String}    compass direction
 */
function windDirection(direction) {

    // const direction = Number( data["current"]["wind_direction_10m"] );

    if(direction >= 0 && direction < 22.5) { return " N"; }
    if(direction >= 22.5 && direction < 67.5) { return " NE"; }
    if(direction >= 67.5 && direction < 112.5) { return " E"; }
    if(direction >= 112.5 && direction < 157.5) { return " SE"; }
    if(direction >= 157.5 && direction < 202.5) { return " S"; }
    if(direction >= 202.5 && direction < 247.5) { return " SW"; }
    if(direction >= 247.5 && direction < 292.5) { return " W"; }
    if(direction >= 292.5 && direction < 337.5) { return " NW"; }
    if(direction >= 337.5 && direction <= 360) { return " N"; }
       
    return "?";
}


// mainline
display();