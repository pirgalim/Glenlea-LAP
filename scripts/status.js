async function call() {
    try {
        const response = await fetch('http://10.84.3.29:5005/status');
        const data = await response.json();
        return data;
    } 
    catch (error) {     
        console.error('Error:', error);
    }
}

async function display() {
    const data = await call();
    // console.log(data);
    
    if(data) {
        update(data);
    }
}


function update(data) {

    const mount = data["mount.is_connected"];
    const tracking = data["mount.is_tracking"];
    const slewing = data["mount.is_slewing"];
    const timeUTC = data["response.timestamp_utc"];

    const mount_text = document.getElementById('mount-text');
    const track_text = document.getElementById('tracking-text');
    const slew_text = document.getElementById('slewing-text');
    const time = document.getElementById('time-status-text');


    // mount status
    if(mount == "true") {
        mount_text.textContent = "◉ Connected";
        mount_text.style.color = "green";
    }
    else {
        mount_text.textContent = "◉ Inactive";
        mount_text.style.color = "gray";
    }


    // tracking status
    if(tracking == "true") {
        track_text.textContent = "◉ Active";
        track_text.style.color = "green";
    }
    else {
        track_text.textContent = "◉ Inactive";
        track_text.style.color = "gray";
    }
    

    // slew status
    if(slewing == "true") {
        slew_text.textContent = "◉ Active";
        slew_text.style.color = "green";
    }
    else {
        slew_text.textContent = "◉ Inactive";
        slew_text.style.color = "gray";
    }
 

    // time status

    time.textContent = timeUTC.split(".")[0] + " UTC";
 
    



    


}


document.addEventListener('DOMContentLoaded', () => display());
setInterval(display, 1000);

// display();