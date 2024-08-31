
document.addEventListener('DOMContentLoaded', () => currentPosition());


async function currentPosition() {

    const ra = document.getElementById('ra-label');
    const dec = document.getElementById('dec-label');
    const alt = document.getElementById('alt-label');
    const az = document.getElementById('az-label');
    const timePos = document.getElementById('timePos-label');
    const status = document.getElementById('status');

    console.log(ra);

    text = document.createElement('p');
    text.textContent = "2h 31m 48s";
    ra.appendChild(text);

    text = document.createElement('p');
    text.textContent = "+89° 15′ 51″";
    dec.appendChild(text);

    text = document.createElement('p');
    text.textContent = "50° 51′ 30";
    alt.appendChild(text);

    text = document.createElement('p');
    text.textContent = "49° 30′ 54";
    az.appendChild(text);

    text = document.createElement('p');
    text.textContent = "... this is a demo";
    timePos.appendChild(text);


    text = document.createElement('h3');
    // statusTest = Math.random() * 2;

    statusTest = -1;

    console.log(statusTest);

    if(Math.floor(statusTest) == 0) {
        text.textContent = "Connected";
        status.appendChild(text);
        status.style.background = "lightgreen";

    }
    else {
        text.textContent = "Disconnected";
        status.appendChild(text);
        status.style.background = "pink";
    }

}

// mainline
// currentPosition();