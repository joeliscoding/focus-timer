let hours, minutes, seconds, breakMinutes;
let insertedHours, insertedMinutes;
let breaks = {
    bool: false,
    when: 30,
    duration: 10,
    amount: 0
}
let isSetup = false, wasReseted = false;
let restTime;
let breakNeeded = false;
let minutesAtBreakTimer;
const timeTillBreak = 35; //Angaben in Minuten
const errorMessage = document.getElementById('error-message');
const timer = {
    el: document.getElementById('timer'),
    interval: 0,
    run: false
}
const breakTimer = {
    el: document.getElementById('break-timer'),
    interval: 0
}
const session = document.getElementById('session');


function insertTime() {
    if(document.getElementById('hours').value > 0) hours = document.getElementById('hours').value;
    else hours = 0;
    if(document.getElementById('minutes').value > 0) minutes = document.getElementById('minutes').value;
    else minutes = 0;
    seconds = 0;
    if((hours > 0 || minutes > 0 || seconds > 0) && minutes < 60 && seconds < 60) {
        setBreak();
        setup();
        insertedHours = hours;
        insertedSeconds = seconds;
        insertedMinutes = minutes;
        isSetup = true;
        errorMessage.innerHTML = '';
    }
    else errorMessage.innerHTML = 'Something went wrong. Please check your entries.';
}

function setup() {
    if(seconds < 10 && typeof seconds != 'string') seconds = '0' + seconds;
    if(minutes < 10 && wasReseted != true) minutes = '0' + minutes;
    if(hours > 0) {timer.el.innerHTML = `${hours}:${minutes}:${seconds}`;}
    else {timer.el.innerHTML = `${minutes}:${seconds}`;}
    session.innerHTML += `
    <button id="play-pause-button" type="button" onclick="if(timer.run === false){timer.interval = setInterval(run, 1000); timer.run = true; if(breakNeeded === true){breakTimer.interval = setInterval(runBreakTimer, 500);}}"><i class="fa-solid fa-play"></i></button>
    <button type="button" onclick="if(timer.run === true){clearInterval(timer.interval); timer.run = false; clearInterval(breakTimer.interval);}"><i class="fa-solid fa-pause"></i></button>
    <button type="button" onclick="if(timer.run === true){clearInterval(timer.interval); timer.run = false; clearInterval(breakTimer.interval);} hours = insertedHours; minutes = insertedMinutes; seconds = 0; reset()"><i class="fa-solid fa-arrow-rotate-left"></i></button>
    
    `;


}

function run() {
    seconds--;
    if(seconds < 0 && (minutes > 0 || hours > 0)) {
        seconds = 59;
        minutes--;
    }
    if(minutes < 0 && hours > 0) {
        minutes = 59;
        hours--;
    }
    if(seconds < 10 && typeof seconds != 'string') seconds = '0' + seconds;
    if(minutes < 10 && typeof minutes != 'string') minutes = '0' + minutes;

    if(hours > 0) timer.el.innerHTML = `${hours}:${minutes}:${seconds}`;
    else timer.el.innerHTML = `${minutes}:${seconds}`;

    if(hours <= 0 && minutes <= 0 && seconds <= 0) {
        clearInterval(timer.interval);
        new Audio('/assets/sounds/ringtone-end.webm').play();
    }
}

function runBreakTimer() {

    if(seconds == 59 && breakMinutes > 0 && minutes != minutesAtBreakTimer) {
        breakMinutes--;
        minutesAtBreakTimer = parseInt(minutes)
    }
    breakTimer.el.innerHTML = `${breakMinutes}:${seconds}`;
    if(breakMinutes <= 0 && seconds <= 0 && breaks.amount > 0 && breaks.bool === false) {
        breaks.bool = true;
        breakMinutes = breaks.duration;
        new Audio('/assets/sounds/ringtone-pause-start.webm').play();
    }
    else if(breakMinutes <= 0 && seconds <= 0 && breaks.amount > 1 && breaks.bool === true) {
        breaks.bool = false;
        breaks.amount--;
        breakMinutes = timeTillBreak;
        new Audio('/assets/sounds/ringtone-pause-end.webm').play();
    }
    else if(breakMinutes <= 0 && seconds <= 0 && breaks.amount == 1 && breaks.bool === true) {
        breaks.bool = false;
        breaks.amount--;
        breakMinutes = minutes;
        new Audio('/assets/sounds/ringtone-pause-end.webm').play();
    }
    else if(breakMinutes <= 0 && seconds <= 0 && breaks.amount <= 0) {
        clearInterval(breakTimer.interval);
    }
}

function reset() {
    session.innerHTML = '';
    timer.el.innerHTML = '';
    wasReseted = true;
    minutesAtBreakTimer = null;
    setBreak();
    setup();
}

function setBreak() {
    const totalTime = hours * 60 + parseInt(minutes);
    let timeWithBreak = totalTime;
    restTime = totalTime;
    if(totalTime > timeTillBreak) {
        //console.log("pause benötigt");
        breakNeeded = true;
        while(restTime > timeTillBreak) {
            restTime -= timeTillBreak;
            breaks.amount++;
        }
        //console.log(breaks.amount, 'mal Pause');
        //console.log(totalTime);
        //console.log(restTime, 'Minuten zeit nach letzter Pause');

        if(wasReseted != true) timeWithBreak += breaks.amount * breaks.duration;
        hours = parseInt(timeWithBreak / 60);
        minutes = timeWithBreak % 60;
        breakMinutes = timeTillBreak;
        breakTimer.el.innerHTML = `${breakMinutes}:${seconds}0`;
        

    }
    //console.log(timeWithBreak)
    //console.log(timeWithBreak);
    //console.log(parseInt(timeWithBreak / 60));
    //console.log(timeWithBreak % 60);
}
