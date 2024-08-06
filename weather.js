async function call() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=49.6363&longitude=-97.1307&hourly=temperature_2m,dew_point_2m,precipitation_probability,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility&daily=sunrise,sunset&timezone=America%2FChicago&past_days=1&forecast_days=3');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}


async function display() {


    const container = document.getElementById('weather-data');

    const data = await call();

    if (!data) {
        return;
    }

    alert(data);




    console.log(Object.keys(data))

    for( const key in data ) {

        console.log(data[key]);

    }




    var body = document.createElement('p');
    body.textContent = data['latitude'];
    container.appendChild(body);


    var box = document.getElementById('sunset1')

    body = document.createElement('p');
    var dateArray = data['daily']['sunset'][0].split("T");
    body.textContent = dateArray[1]
    box.appendChild(body);
    


}




// mainline
display();