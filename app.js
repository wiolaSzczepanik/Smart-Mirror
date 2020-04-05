'use strict';

/*CLOCK */

let date = startTime();
document.getElementById("clock").innerHTML = date;

function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = today.toDateString() + " " + h + ":" + m + ":" + s;
    let t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }
    ;  // add zero in front of numbers < 10
    return i;
}

/*WEATHER */

// api key : 82005d27a116c2880c8f0fcb866998a0

// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const weather = {};

weather.temperature = {
    unit: "celsius"
}

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
            weather.description = data.weather[0].description;
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
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${city}, ${weather.country}`;
}


//AIR

// apikey : 15PTXuSyrYjJjRTs5mnPSqoF1Y52tm6l

const airDescription = document.querySelector(".air-description");
const airValue = document.querySelector(".air-value");
const airPM2 = document.querySelector(".air-pm2");
const airPm10 = document.querySelector(".air-pm10");
const airColor = document.querySelector(".air-color");

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
        airData.description = data.current.indexes[0].advice;
        airData.level = data.current.indexes[0].level;
        airData.value = `${data.current.indexes[0].value}<span> CAQI</span>`;
        airData.pm2 = `${data.current.values[1].value}<span> PM2.5</span>`;
        airData.pm10 = `${data.current.values[2].value}<span> PM10</span>`;
        airData.color = data.current.indexes[0].color;
    }).then(function () {
        displayAirConditions()
    })
}

function displayAirConditions(){
    document.querySelector(".air-container").style.backgroundColor= airData.color;
    airValue.innerHTML= airData.value;
    airDescription.innerHTML=airData.description;
    airPM2.innerHTML=airData.pm2;
    airPm10.innerHTML=airData.pm10;
}

//lat=50.062006&lng=19.940984

let air = getAirMeasurements(50.062006, 19.940984);
// document.getElementById("air-notification").innerHTML = air;


//FINANCE

const percent = document.querySelector(".percent");

const financeData={};

function getFinanceData(){
    const url ="http://localhost:5000/finance";

    console.log("dada: ",url);
    fetch(url, {
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin":"http://localhost:5000/finance",
        }
    }).then(function (responde) {
        let data = responde.json();
        console.log("finance: ",data);
        return data;
    }).then(function (data) {
        financeData.homeOwnership=`${data.homeOwnership*100}<span>%</span>`;
        financeData.summaryDone=data.summaryDone;
        financeData.transferMade=data.transferMade;

        displayFinance();
    })
}

function displayFinance(){
    percent.innerHTML=financeData.homeOwnership;
}

getFinanceData();