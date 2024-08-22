

var rate = 1000;


document.getElementById("0s-indoor").addEventListener("click", ()=> { varChange(0) } );
document.getElementById("1s-indoor").addEventListener("click", ()=> { varChange(1000) });
document.getElementById("10s-indoor").addEventListener("click", ()=> { varChange(10000) });
document.getElementById("30s-indoor").addEventListener("click", ()=> { varChange(30000) });


function varChange(newVal) {

    rate = newVal;
}


function play(time) {

    console.log(time);

    
    window.setInterval(function(){
        $("#update").load("/");

        // use jquery to change srcs?

        document.getElementById("outdoor").src = "http://allsky.physics.umanitoba.ca/outdoor.png?"+ new Date().getTime();
        document.getElementById("indoor").src = "http://allsky.physics.umanitoba.ca/indoor.png?"+ new Date().getTime();
        
    }, time)
}


// play(1000)




function updateImage() {
    $('#indoor').attr('src', 'http://allsky.physics.umanitoba.ca/indoor.png?' + new Date().getTime());
}

setInterval(updateImage, rate); // Update every second