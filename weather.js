async function call() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=49.6363&longitude=-97.1307&current=temperature_2m,precipitation&hourly=temperature_2m,dew_point_2m,precipitation_probability,cloud_cover,visibility&daily=sunrise,sunset&timezone=America%2FChicago&past_days=1&forecast_days=3');
        const data = await response.json();
        return data;
    } catch (error) {

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



    var currentArray = Object.values(data["current"]);
    var currentUnitsArray = Object.values(data["current_units"]);

    var elements = document.getElementsByClassName("current");




    for(let i = 0; i < elements.length; i++) {

            if(currentUnitsArray[i] != "seconds") {
                var body = document.createElement('p');

                if(currentUnitsArray[i] != "iso8601") {
                    body.textContent = currentArray[i] + " " + currentUnitsArray[i]
                }
                else {
                    body.textContent = currentArray[i].split("T")[1]
                }

                
                console.log(body.textContent);
                elements[i].appendChild(body);
            }


            
    }






    





    // var elements = document.getElementsByClassName("current");
    // var counter = 0; 
    // for(const key in data["current"]) {

    //     if(key != "interval") {
    //         console.log(data["current"][key]);

    //         var body = document.createElement('p');
    //         body.textContent = data["current"][key];
    //         console.log(body.textContent);
    //         elements[counter].appendChild(body);

    //         counter++;
    //     }
        
    // }



}



// function newPopulate(data, className, category, delim) {

//     var elements = document.getElementsByClassName(className);

//     var currentArray = Object.values(data[className]);
//     var currentUnitsArray = Object.values(data[className + "_units"]);



//     for(let i = 0; i < elements.length; i++) {        
//             var body = document.createElement('p');
//             body.textContent = currentArray[i] + " " + currentUnitsArray[i]
//             console.log(body.textContent);
//             elements[i].appendChild(body);  
//     }
// }




function populate(data, className, category, delim) {


    var elements = document.getElementsByClassName(className);

    

    if(delim) {

        for(let i = 0; i < elements.length; i++) {

            var body = document.createElement('p');
            var dateArray = data[category][className][i].split(delim);
            body.textContent = dateArray[1]

            console.log(body.textContent);

            elements[i].appendChild(body);
        }

        // for(const key in data[category]) {

        //     console.log(data[category][key]);

        // }
    }


}



// mainline
display();