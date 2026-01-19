/**
 * WebSocket Status Handler for Glenlea LAP
 * Replaces the polling mechanism in status.js
 */

const CONFIG = {
    // TODO: Replace with your actual WebSocket URL
    WS_URL: 'ws://ac19bugf.physics.umanitoba.ca/ws',
    RECONNECT_INTERVAL: 5000
};

let socket;

function connect() {
    console.log("Connecting to WebSocket...");
    socket = new WebSocket(CONFIG.WS_URL);

    socket.onopen = function (e) {
        console.log("WebSocket connection established");
        // Optional: Send a subscription message if required
        // socket.send(JSON.stringify({ type: 'subscribe', channel: 'status' }));
    };

    socket.onmessage = function (event) {
        try {
            const data = JSON.parse(event.data);
            update(data);
        } catch (e) {
            console.error("Error parsing WebSocket message:", e);
        }
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`WebSocket connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.warn('WebSocket connection died');
        }
        // Attempt to reconnect
        setTimeout(connect, CONFIG.RECONNECT_INTERVAL);
    };

    socket.onerror = function (error) {
        console.error(`WebSocket error: ${error.message}`);
    };
}

/**
 * Updates the DOM with the received data
 * @param {Object} data - The JSON data received from the WebSocket
 */
function update(data) {
    // 1. Status Indicators
    const mount = data["mount.is_connected"];
    const tracking = data["mount.is_tracking"];
    const slewing = data["mount.is_slewing"];
    const focuser = data["focuser.is_connected"];
    const rotator = data["rotator.is_connected"];

    // New Attribute: Filter Position (Placeholder)
    // Adjust the key name based on your actual API
    const filterPos = data["filter_wheel.position"] || data["filter.position"];

    const mount_text = document.getElementById('mount-text');
    const track_text = document.getElementById('tracking-text');
    const slew_text = document.getElementById('slewing-text');
    const slew_prog = document.getElementById('slew-progress');
    const focuser_text = document.getElementById('focuser-text');
    const rotator_text = document.getElementById('rotator-text');

    // Helper for status text/color
    function setStatus(status, element, messageT, messageF) {
        if (element) {
            if (String(status) === "true") {
                element.textContent = messageT;
                element.style.color = "green";
            } else {
                element.textContent = messageF;
                element.style.color = "gray";
            }
        }
    }

    setStatus(mount, mount_text, "Connected", "Disconnected");
    setStatus(tracking, track_text, "Active", "Inactive");
    setStatus(focuser, focuser_text, "Active", "Disconnected");
    setStatus(rotator, rotator_text, "Active", "Disconnected");

    // Slew Status (Custom logic from original file)
    if (String(slewing) === "true") { // Removed "FIXME" check for production readiness
        if (slew_prog) slew_prog.style.display = "block";
    } else {
        if (slew_prog) slew_prog.style.display = "none";
        if (slew_text) {
            slew_text.textContent = "Inactive";
            slew_text.style.color = "gray";
        }
    }

    // 2. Time Status
    const timeUTC = data["response.timestamp_utc"];
    const timeElement = document.getElementById('time-status-text');

    if (timeUTC && timeElement) {
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
        timeElement.textContent = formatter.format(date).replace(/,/g, '');
    }

    // 3. Position Data (RA, Dec, Alt, Az)
    const ra = document.getElementById('ra-text');
    const dec = document.getElementById('dec-text');
    const alt = document.getElementById('alt-text');
    const az = document.getElementById('az-text');
    const ax_dist = document.getElementById('ax-dist-text');

    // Calculations
    if (data["mount.ra_j2000_hours"] !== undefined) {
        const hr_ra = data["mount.ra_j2000_hours"] * (1 / 15); // convert to hours from degrees? (Original logic preserved)
        // Note: Original comment said "convert to hours from degrees" but multiplied by 1/15. 
        // If input is degrees, /15 gives hours. If input is hours, this might be wrong. 
        // Assuming original logic was correct for the data source.

        const min_ra = (hr_ra - Math.floor(hr_ra)) * 60;
        const sec_ra = (min_ra - Math.floor(min_ra)) * 60;

        if (ra) ra.textContent = `${Math.round(hr_ra)}h ${Math.round(min_ra)}' ${Math.round(sec_ra * 10) / 10}''`;
    }

    if (data["mount.dec_j2000_degs"] !== undefined) {
        const hr_dec = data["mount.dec_j2000_degs"];
        const min_dec = (Math.abs(hr_dec) - Math.floor(Math.abs(hr_dec))) * 60;
        const sec_dec = (min_dec - Math.floor(min_dec)) * 60;

        if (dec) dec.textContent = `${Math.round(hr_dec)}° ${Math.round(min_dec)}' ${Math.round(sec_dec * 10) / 10}''`;
    }

    if (alt && data["mount.altitude_degs"] !== undefined) {
        alt.textContent = (Math.round(data["mount.altitude_degs"] * 1000) / 1000) + "°";
    }

    if (az && data["mount.azimuth_degs"] !== undefined) {
        az.textContent = (Math.round(data["mount.azimuth_degs"] * 1000) / 1000) + "°";
    }

    if (ax_dist && data["mount.axis0.dist_to_target_arcsec"] !== undefined) {
        const ra_dist = data["mount.axis0.dist_to_target_arcsec"];
        const dec_dist = data["mount.axis1.dist_to_target_arcsec"];
        const total_dist = Math.sqrt(ra_dist ** 2 + dec_dist ** 2);
        ax_dist.textContent = total_dist + "''";
    }

    // 4. Handle New Attributes (Filter Position)
    // You will need to add an element with id="filter-text" to your HTML to see this
    const filterElement = document.getElementById('filter-text');
    if (filterElement && filterPos !== undefined) {
        filterElement.textContent = filterPos;
    }
}

// Start connection when DOM is ready
document.addEventListener('DOMContentLoaded', () => connect());
