'use strict';

/*CLOCK */

let time = startTime();
document.getElementById("clock").innerHTML = time;

function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML =  " " + h + ":" + m + ":" + s;
    let t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }
    ;  // add zero in front of numbers < 10
    return i;
}
//DATE
let todayDate = new Date();
let date = todayDate.toDateString();
document.getElementById('date').innerText = date;


/*WEATHER */

// api key : 82005d27a116c2880c8f0fcb866998a0

// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
// const descElement = document.querySelector(".temperature-advice p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {};

weather.temperature = {
    unit: "celsius"
};

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "82005d27a116c2880c8f0fcb866998a0";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}


//get weather from api
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            // weather.advice = data.weather[0].advice;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        });
}

// DISPLAY WEATHER TO UI
function displayWeather() {
    let city = "";
    if (weather.city === "Śródmieście") {
        city = "Kraków"
    }
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    // descElement.innerHTML = weather.advice;
    locationElement.innerHTML = `${city}, ${weather.country}`;
}


//AIR

// apikey : 15PTXuSyrYjJjRTs5mnPSqoF1Y52tm6l

const airAdvice = document.querySelector(".air-advice");
const airValue = document.querySelector(".air-value");
const airLevel = document.querySelector(".air-level");
// const airDescription = document.querySelector("air-description");
// const airPM2 = document.querySelector(".air-pm2");
// const airPm10 = document.querySelector(".air-pm10");

const airData = {};

function getAirMeasurements(latitude, longitude) {
    const airlyApi = `https://airapi.airly.eu/v2/measurements/point?lat=${latitude}&lng=${longitude}`;

    fetch(airlyApi, {
        headers: {
            "Accept": "application/json",
            "apikey": "15PTXuSyrYjJjRTs5mnPSqoF1Y52tm6l"
        }
    }).then(function (response) {
        let data = response.json();
        return data;
    }).then(function (data) {
        airData.advice = data.current.indexes[0].advice;
        airData.level = data.current.indexes[0].level;
        airData.value = data.current.indexes[0].value;
        // airData.color = data.current.indexes[0].color;
        // airData.description = data.current.indexes[0].description;
    }).then(function () {
        displayAirConditions()
    })
}

function displayAirConditions() {
    console.log("level: " + airData.level);

    // document.querySelector(".air-container").style.backgroundColor = airData.color;
    airValue.innerHTML = `${airData.value}<span style="font-size: 0.5em">CAQI</span>`;
    airAdvice.innerHTML = airData.advice;
    airLevel.innerHTML = `<img src="icons/${airData.level}.png"/>`;
    // airDescription.innerHTML = airData.description;

}

//lat=50.062006&lng=19.940984

let air = getAirMeasurements(50.062006, 19.940984);


//FINANCE

const percent = document.querySelector(".percent");

const financeData = {};

function getFinanceData() {
    const url = "http://localhost:5000/finance";

    console.log("dada: ", url);
    fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:5000/finance",
        }
    }).then(function (responde) {
        let data = responde.json();
        console.log("finance: ", data);
        return data;
    }).then(function (data) {
        financeData.homeOwnership = `${(data.homeOwnership * 100).toFixed(2)}<span>%</span>`;
        financeData.summaryDone = data.summaryDone;
        financeData.transferMade = data.transferMade;
        changeBackgroundColor();
        displayFinance();
    })
}

function displayFinance() {
    percent.innerHTML = financeData.homeOwnership;
}

function changeBackgroundColor() {
    if (financeData.summaryDone === "0") {
        document.querySelector(".apartment-container").style.backgroundColor = 'red';
        return;
    }
    if (financeData.transferMade === "0") {
        document.querySelector(".apartment-container").style.backgroundColor = 'orange';
        return;
    }
    document.querySelector(".apartment-container").style.backgroundColor = 'green';

}


getFinanceData();