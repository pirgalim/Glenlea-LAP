/**
 * Calls weather api
 * @returns weather data
 */
async function call() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=49.6363&longitude=-97.1307&current=temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=America%2FChicago&past_days=1&forecast_days=3');
        const data = await response.json();
        return data;
    } 
    catch (error) {

        // locate error div
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
    hourlyConditions(data);
}


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
    console.log(elements);

    // HTML body element
    var body;

    // temperature
    body = document.createElement('p');
    body.textContent = current["temperature_2m"] + currentUnits["temperature_2m"];
    elements[0].appendChild(body);

    // cloud cover
    body = document.createElement('p');
    body.textContent = current["cloud_cover"] + currentUnits["cloud_cover"];
    elements[1].appendChild(body);

    // precipitation
    body = document.createElement('p');
    body.textContent = current["precipitation"] + " " + currentUnits["precipitation"];
    elements[2].appendChild(body);

    // wind speed
    const direction = Number( data["current"]["wind_direction_10m"] );
    body = document.createElement('p');
    body.textContent = current["wind_speed_10m"] + " " + currentUnits["wind_speed_10m"] + " " + windDirection(direction);
    elements[3].appendChild(body);

    // timestamp from last request
    body = document.createElement('p');
    var time = current["time"].split("T");
    body.textContent = time[0] + " at " + time[1] + " "; // data["timezone_abbreviation"]
    elements[4].appendChild(body);
}


/**
 * Formats 'data' and creates elements in specified classes
 * @param {*} data 
 */
function hourlyConditions(data) {

    
    const hourly = data["hourly"];  
    const hourlyUnits = data["hourly_units"]; 



    // time of last update
    const currTime = data["current"]["time"];

    // hourly time data
    const times = hourly["time"];

    // hourly cloud cover data
    const clouds = hourly["cloud_cover"];
    const cloudUnits = hourlyUnits["cloud_cover"];

    // hourly precipitation data
    const precipitation = hourly["precipitation_probability"];
    const precipitationUnits = hourlyUnits["precipitation_probability"];

    // hourly temperature data
    const temp = hourly["temperature_2m"];
    const tempUnits = hourlyUnits["temperature_2m"];

    // hourly temperature data
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
    const elements = document.getElementsByClassName("block-small");
    console.log(elements.length);
    
    // append data to each element from 'elements'
    for(let i = 0; i < elements.length; i++) {

        const type = 'div';
    
        // time styling
        body = document.createElement(type); 
        body.textContent = times[startPosition + i];
        elements[i].appendChild(body);

        // midnight indicator
        if(times[startPosition + i] == "00:00") {  body.style.background = "red"; }
        else { body.style.background = "lightgray"; }
        body.style.padding = "10px";
        

        // temperature styling
        var tempRound = Math.round( temp[startPosition + i] );
        body = document.createElement(type);
        body.textContent = tempRound + tempUnits;
        elements[i].appendChild(body);
        body.style.padding = "10px";
        // colour indicator 
        if(temp[startPosition + i] > 0) { body.style.background = 'rgba(255, 180, 0, ' + temp[startPosition + i]/30 + ')'; }
        else { body.style.background = 'rgba(180, 180, 255, ' + temp[startPosition + i]/(-30) + ')'; }
                
        // precipitation styling
        body = document.createElement(type);
        body.textContent = precipitation[startPosition + i] + precipitationUnits;
        elements[i].appendChild(body);
        body.style.padding = "10px";
        // colour indicator 
        body.style.background = 'rgba(180, 120, 256, ' + precipitation[startPosition + i]/100 + ')';

        
        // cloud cover styling
        body = document.createElement(type);
        body.textContent = clouds[startPosition + i] + cloudUnits;
        elements[i].appendChild(body);
        body.style.padding = "10px";
        // colour indicator 
        body.style.background = 'rgba(80, 135, 256, ' + clouds[startPosition + i]/100 + ')';

       
        
        


        // wind speed styling
        // body = document.createElement(type);
        // body.textContent = Math.round( wind[startPosition + i] ) + " " + windDirection(windDir[i]);
        // elements[i].appendChild(body);
        // body.style.padding = "10px";

        // // colour indicator 
        // rgba = 'rgba(80, 255, 80, ' + wind[startPosition + i]/30 + ')';
        // body.style.background = rgba;

        

        // colour1 = 'rgba(80, 255, 80, ';
        addElement(elements, wind, startPosition, i, null, 30, windDirection(windDir[i]));

    }
}


function addElement(elements, condition, current, pos, colour, threshold, units) {

        var rounded = Math.round( condition[current + pos] );


        div = document.createElement('div');

        div.textContent = Math.round( condition[current + pos] ) + " " + units;

        elements[pos].appendChild(div);

        div.style.padding = "10px";


        rgba = 'rgba(80, 255, 80, ' + condition[current + pos]/threshold + ')';
        div.style.background = rgba;

}



/**
 * Adds space between elements
 * @param {*} elements  array of elements in the DOM
 * @param {*} i         index of the desired element
 */
function addSpace(elements, i) {
    body = document.createElement('br');
    elements[i].appendChild(body);
    body = document.createElement('br');
    elements[i].appendChild(body);
}


/**
 * Converts wind direction from degrees to a more readable format
 * @param {*} data      api data object
 * @returns {String}    compass direction
 */
function windDirection(direction) {

    // const direction = Number( data["current"]["wind_direction_10m"] );

    if(direction >= 337.5 && direction < 22.5) { return "N"; }
    if(direction >= 22.5 && direction < 67.5) { return "NE"; }
    if(direction >= 67.5 && direction < 112.5) { return "E"; }
    if(direction >= 112.5 && direction < 157.5) { return "SE"; }
    if(direction >= 157.5 && direction < 202.5) { return "S"; }
    if(direction >= 202.5 && direction < 247.5) { return "SW"; }
    if(direction >= 247.5 && direction < 292.5) { return "W"; }
    if(direction >= 292.5 && direction < 337.5) { return "NW"; }
   
    return "?";
}


// mainline
display();