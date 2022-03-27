let hours, minutes, seconds;
let insertedHours, insertedMinutes, insertedSeconds;
let isSetup = false;
const timer = {
    el: document.getElementById('timer'),
    interval: 0,
    run: false
}
const session = document.getElementById('session');


function insertTime() {
    if(document.getElementById('hours').value > 0) hours = document.getElementById('hours').value;
    else hours = 0;
    if(document.getElementById('minutes').value > 0) minutes = document.getElementById('minutes').value;
    else minutes = 0;
    if(document.getElementById('seconds').value > 0) seconds = document.getElementById('seconds').value;
    else seconds = 0;
    if(hours > 0 || minutes > 0 || seconds > 0) {
        setup();
        insertedHours = hours;
        insertedSeconds = seconds;
        insertedMinutes = minutes;
    }
    else document.getElementById('error').innerHTML = 'Something went wrong. Please check your entries.';
}

function setup() {
    if(hours > 0) {timer.el.innerHTML = `${hours}:${minutes}:${seconds}`;}
    else {timer.el.innerHTML = `${minutes}:${seconds}`;}
    session.innerHTML += `
    <button id="play-pause-button" type="button" onclick="if(timer.run === false){timer.interval = setInterval(run, 1000); timer.run = true;}"><i class="fa-solid fa-play"></i></button>
    <button type="button" onclick="if(timer.run === true){clearInterval(timer.interval); timer.run = false;}"><i class="fa-solid fa-pause"></i></button>
    <button type="button" onclick="if(timer.run === true){clearInterval(timer.interval); timer.run = false;} hours = insertedHours; minutes = insertedMinutes; seconds = insertedSeconds; reset()"><i class="fa-solid fa-arrow-rotate-left"></i></button>
    
    `;
}

function run() {
    seconds--;
    if(seconds < 0 && (minutes > 0 || hours > 0)){
        seconds = 59;
        minutes--;
    }
    if(minutes < 0 && hours > 0) {
        minutes = 59;
        hours--;
    }
    if(hours > 0) {timer.el.innerHTML = `${hours}:${minutes}:${seconds}`;}
    else {timer.el.innerHTML = `${minutes}:${seconds}`;}
    if(hours <= 0 && minutes <= 0 && seconds <= 0){
        clearInterval(timer.interval);
    }
}

function reset() {
    session.innerHTML = '';
    timer.el.innerHTML = '';
    setup();
}