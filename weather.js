async function call() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=49.6363&longitude=-97.1307&current=temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,cloud_cover&daily=sunrise,sunset&timezone=America%2FChicago&past_days=1&forecast_days=3');
        const data = await response.json();
        return data;
    } catch (error) {

        alert("Error Retrieving Forecast");
        console.error('Error:', error);
    }
}


async function display() {

    const data = await call();

    if (!data) {

        return;
    }
   
    populate(data, "sunset", "daily", "T");
    populate(data, "sunrise", "daily", "T");



    currentCondtions(data);

    hourlyConditions(data);
}







function hourlyConditions(data) {

    // hourly data
    const hourly = data["hourly"];

    // units for hourly data
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
    
    // append data to each element from 'elements'
    for(let i = 0; i < elements.length; i++) {

        body = document.createElement('p');
        body.textContent = times[startPosition + i];
        elements[i].appendChild(body);

        body = document.createElement('br');
        elements[i].appendChild(body);
        body = document.createElement('br');
        elements[i].appendChild(body);

        var tempRound = Math.round( temp[startPosition + i] );
        body = document.createElement('p');
        body.textContent = tempRound + tempUnits;
        elements[i].appendChild(body);

        body = document.createElement('br');
        elements[i].appendChild(body);
        body = document.createElement('br');
        elements[i].appendChild(body);
        
        body = document.createElement('p');
        body.textContent = precipitation[startPosition + i] + precipitationUnits;
        elements[i].appendChild(body);

        body = document.createElement('br');
        elements[i].appendChild(body);
        body = document.createElement('br');
        elements[i].appendChild(body);
        
        body = document.createElement('p');
        body.textContent = clouds[startPosition + i] + cloudUnits;
        elements[i].appendChild(body);
    }
}





function windDirection(data) {

    
    const direction = Number( data["current"]["wind_direction_10m"] );


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









function currentCondtions(data) {




    const current = data["current"];
    const currentUnits = data["current_units"];


    // obtain list of headings that are part of the 'current' class
    const elements = document.getElementsByClassName("current");
    // expected output??


    var body;


    // console.log(elements[0]);


    

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

    // precipitation
    body = document.createElement('p');
    body.textContent = current["wind_speed_10m"] + " " + currentUnits["wind_speed_10m"] + " " + windDirection(data);
    elements[3].appendChild(body);

    // timestamp from last request
    body = document.createElement('p');
    var time = current["time"].split("T");
    body.textContent = time[0] + " at " + time[1] + " " + data["timezone_abbreviation"];
    elements[4].appendChild(body);
    

}












function populate(data, className, category, delim) {


    var elements = document.getElementsByClassName(className);

    

    if(delim) {

        for(let i = 0; i < elements.length; i++) {

            var body = document.createElement('p');
            var dateArray = data[category][className][i].split(delim);
            body.textContent = dateArray[1]

            // console.log(body.textContent);

            elements[i].appendChild(body);
        }

        // for(const key in data[category]) {

        //     console.log(data[category][key]);

        // }
    }


}



// mainline
display();