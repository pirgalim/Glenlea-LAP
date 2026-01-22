async function call() {
    try {

        // todo: try changing this to a proxy
        const response = await fetch('https://ac19bugf.physics.umanitoba.ca');
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error:', error);
    }
}




async function display() {
    const data = await call();
    if (data) {
        update(data);
    } else {
        showOffline();
    }
}

function showOffline() {
    const containers = [
        document.querySelector('#status-info .inner-container'),
        document.querySelector('#current-position .inner-container'),
        document.querySelector('#additional-data .inner-container')
    ];

    containers.forEach(container => {
        if (container) {
            container.innerHTML = '<div style="width:100%; text-align:center; padding: 20px; font-weight: bold; color: gray;">System Offline - Unable to fetch data</div>';
        }
    });
}


function update(data) {

    const mount = data["mount.is_connected"];
    const tracking = data["mount.is_tracking"];
    const slewing = data["mount.is_slewing"];
    const focuser = data["focuser.is_connected"];
    const rotator = data["rotator.is_connected"];
    const timeUTC = data["response.timestamp_utc"];

    const mount_text = document.getElementById('mount-text');
    const track_text = document.getElementById('tracking-text');
    const slew_text = document.getElementById('slewing-text');
    const slew_prog = document.getElementById('slew-progress');
    const focuser_text = document.getElementById('focuser-text');
    const rotator_text = document.getElementById('rotator-text');




    const time = document.getElementById('time-status-text');




    /**
   * SET STATUS PURPOSE TODO:
   * @param {String} status         API status result
   * @param {HTMLElement} element   Text element to be modified
   * @param {String} messageT       Text to display if true
   * @param {String} messageF       Text to display if false
   */
    function setStatus(status, element, messageT, messageF) {

        if (status == "true") {
            element.textContent = messageT;
            element.style.color = "green";
        }
        else {
            element.textContent = messageF;
            element.style.color = "gray";
        }
    }


    setStatus(mount, mount_text, "Connected", "Disconnected");
    setStatus(tracking, track_text, "Active", "Inactive");




    // ◉ 

    // mount status
    // if(mount == "true") {
    //     mount_text.textContent = "Connected";
    //     mount_text.style.color = "green";
    // }
    // else {
    //     mount_text.textContent = "Disconnected";
    //     mount_text.style.color = "red";
    // }


    // tracking status
    // if(tracking == "true") {
    //     track_text.textContent = "Active";
    //     track_text.style.color = "green";
    // }
    // else {
    //     track_text.textContent = "Inactive";
    //     track_text.style.color = "gray";
    // }


    // slew status
    if (slewing == "true FIXME:") {
        // slew_text.textContent = "Active";
        // slew_text.style.color = "green";
        slew_prog.style.display = "block";
    }
    else {
        slew_prog.style.display = "none";
        slew_text.textContent = "Inactive";
        slew_text.style.color = "gray";
    }


    // focuser status
    if (focuser == "true") {
        focuser_text.textContent = "Active";
        focuser_text.style.color = "green";

        // if()

    }
    else {
        focuser_text.textContent = "Disconnected";
        focuser_text.style.color = "gray";
    }


    // rotator status
    if (rotator == "true") {
        rotator_text.textContent = "Active";
        rotator_text.style.color = "green";
    }
    else {
        rotator_text.textContent = "Disconnected";
        rotator_text.style.color = "gray";
    }


    // time status

    // time status
    const date = new Date(timeUTC + (timeUTC.endsWith("Z") ? "" : "Z"));
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Winnipeg',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    });
    time.textContent = formatter.format(date).replace(/,/g, '');







    const ra = document.getElementById('ra-text');
    const dec = document.getElementById('dec-text');
    const alt = document.getElementById('alt-text');
    const az = document.getElementById('az-text');
    const ax_dist = document.getElementById('ax-dist-text');






    const hr_ra = data["mount.ra_j2000_hours"] * (1 / 15)  // convert to hours from degrees
    const min_ra = (hr_ra - Math.floor(hr_ra)) * 60
    const sec_ra = (min_ra - Math.floor(min_ra)) * 60




    ra.textContent = Math.round(hr_ra) + "h " + Math.round(min_ra) + "' " + Math.round(sec_ra * 10) / 10 + "''"

    // ra.textContent = Math.round(hr * 1000)/1000 + " hours"

    const hr_dec = data["mount.dec_j2000_degs"]  // convert to hours from degrees

    // console.log(hr_dec)

    const min_dec = (hr_dec - Math.floor(hr_dec)) * 60
    const sec_dec = (min_dec - Math.floor(min_dec)) * 60



    // dec.textContent = Math.round(data["mount.dec_j2000_degs"] * 1000)/1000 + " degrees"
    dec.textContent = Math.round(hr_dec) + "° " + Math.round(min_dec) + "' " + Math.round(sec_dec * 10) / 10 + "''"


    alt.textContent = Math.round(data["mount.altitude_degs"] * 1000) / 1000 + "°"
    az.textContent = Math.round(data["mount.azimuth_degs"] * 1000) / 1000 + "°"



    // ax_dist.textContent = "N/A";

    // ax_dist.textContent = "RA: " + data["mount.axis0.dist_to_target_arcsec"] + "''" + " - " + "DEC: " + data["mount.axis1.dist_to_target_arcsec"] + "''";

    const ra_dist = data["mount.axis0.dist_to_target_arcsec"]
    const dec_dist = data["mount.axis1.dist_to_target_arcsec"]
    const total_dist = Math.sqrt(ra_dist ** 2 + dec_dist ** 2)
    ax_dist.textContent = total_dist + "''";
}


document.addEventListener('DOMContentLoaded', () => display());
setInterval(display, 1000);

// display();
