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


    // ◉ 

    // mount status
    if(mount == "true") {
        mount_text.textContent = "Connected";
        mount_text.style.color = "green";
    }
    else {
        mount_text.textContent = "Disconnected";
        mount_text.style.color = "red";
    }


    // tracking status
    if(tracking == "true") {
        track_text.textContent = "Active";
        track_text.style.color = "green";
    }
    else {
        track_text.textContent = "Inactive";
        track_text.style.color = "gray";
    }
    

    // slew status
    if(slewing == "true") {
        slew_text.textContent = "Active";
        slew_text.style.color = "green";
    }
    else {
        slew_text.textContent = "Inactive";
        slew_text.style.color = "gray";
    }
 

    // time status

    time.textContent = timeUTC.split(".")[0] + " UTC";
 
    





    const ra = document.getElementById('ra-text');
    const dec = document.getElementById('dec-text');
    const alt = document.getElementById('alt-text');
    const az = document.getElementById('az-text');




    const hr_ra = data["mount.ra_j2000_hours"] * (1/15)  // convert to hours from degrees
    const min_ra = (hr_ra-Math.floor(hr_ra))*60
    const sec_ra = (min_ra-Math.floor(min_ra))*60

   

    
    ra.textContent = Math.round(hr_ra) + "h " + Math.round(min_ra) + "' " + Math.round(sec_ra*10)/10 + "''" 

    // ra.textContent = Math.round(hr * 1000)/1000 + " hours"

    const hr_dec = data["mount.dec_j2000_degs"]  // convert to hours from degrees

    // console.log(hr_dec)

    const min_dec = (hr_dec-Math.floor(hr_dec))*60
    const sec_dec = (min_dec-Math.floor(min_dec))*60



    // dec.textContent = Math.round(data["mount.dec_j2000_degs"] * 1000)/1000 + " degrees"
    dec.textContent = Math.round(hr_dec) + "° " + Math.round(min_dec) + "' " + Math.round(sec_dec*10)/10 + "''" 
    

    alt.textContent =  Math.round(data["mount.altitude_degs"] * 1000)/1000 + " degrees"
    az.textContent = Math.round(data["mount.azimuth_degs"] * 1000)/1000 + " degrees"

}


document.addEventListener('DOMContentLoaded', () => display());
setInterval(display, 1000);

// display();