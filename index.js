console.log("index.js is loading"); //debugging to check is js is loading in production

const weatherForm = document.querySelector(".weatherForm"); //accessing the first element of the weatherForm class
const cityInput = document.querySelector(".cityInput"); //accessing the first element of the cityInput class
const card = document.querySelector(".card"); //accessing the first element of the card class
const mainTemp = document.querySelector(".mainTemp");
const subTemp = document.querySelector(".subTemp");
const weather = document.querySelector(".weather");
const box1 = document.querySelector("#box1");
const box2 = document.querySelector("#box2");
const box3 = document.querySelector("#box3");
const box4 = document.querySelector("#box4");
const cityPlaceholder = document.querySelector(".cityPlaceholder");
const emojiPlaceholder = document.querySelector(".emojiPlaceholder");
const apikey = "5d1baf138276f4bef7771e4fd9bb317e"; //our personal weatherapi key
const imgapikey = "h7StbBt4tOaD3V5K0pL7L4djagEEamN-mPuNqut45aM"; //our personal image api key

weatherForm.addEventListener("submit", async event => { //EventListener for when our submit button is clicked
    event.preventDefault(); //prevents default page-refresh action of forms
    const city = cityInput.value; //gets the city that user inputs using value property
    if(city) { //if a city exists, do this
        try {
            const weatherData = await getWeatherData(city); //await to receive weather data from function
            const cityImg = await getCityImg(city) 
            clearError(); //checks if there is an error that needs to be cleared
            displayCityImg(cityImg); //pass in our img data
            displayWeatherInfo(weatherData); //pass in our weather data to our other function that will display this data
        } catch (error) { //catches an error if there is one
            console.error(error); //logs error to console
            displayError(error); //displays error using our displayError message
        }
    } else { //else, call our displayError function to display an error message
        displayError("Please enter a city."); //our error message
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`; //url for our api calls
    const response = await fetch(apiUrl); //fetching the data we want from our weather api url
    if(!response.ok) { //if there is no data...
        throw new Error("Could not fetch weather data"); //throw an error
    }
    return await response.json(); //return a json object
}

//similar functionality as the above getWeatherData function
async function getCityImg(city) {
    const apiUrl = `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${imgapikey}`;
    const response = await fetch(apiUrl);
    if(!response.ok) {
        throw new Error("Could not fetch city image data");
    }
    return await response.json()
}

//destructure and use data
function displayCityImg(data) {
    const {results: [{urls: {full}}]} = data;
    document.body.style.backgroundImage = `url(${full})`;
}

//destructure and use data
function displayWeatherInfo(data) {
    const {name: city, 
        main: {temp, humidity, feels_like, pressure, temp_max, temp_min},
        visibility,
        weather: [{description, id}]} = data;
    //resets text if there is any
    mainTemp.textContent = "";
    subTemp.textContent = "";
    box1.textContent = "";
    box2.textContent = "";
    box3.textContent = "";
    box4.textContent = "";
    cityPlaceholder.textContent = "";
    emojiPlaceholder.textContent = "";

    card.style.display = "flex"; //sets flexbox display

    //this block creates the elements we need
    const cityDisplay = document.createElement("p");
    const tempDisplayF = document.createElement("p");
    const tempDisplayC = document.createElement("p");
    const emojiDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const tempMinMaxDisplay = document.createElement("p");
    const feelsTitle = document.createElement("p");
    const feelsDisplay = document.createElement("p");
    const pressureTitle = document.createElement("p");
    const pressureDisplay = document.createElement("p");
    const humidityTitle = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const visTitle = document.createElement("p");
    const visDisplay = document.createElement("p");

    //this block populates these elements using textContent and our data
    cityDisplay.textContent = city;
    tempDisplayF.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`;
    tempDisplayC.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    emojiDisplay.textContent = getWeatherEmoji(id);
    descDisplay.textContent = description;
    tempMinMaxDisplay.textContent = `H: ${((temp_max - 273.15) * (9/5) + 32).toFixed(1)}° L: ${((temp_min - 273.15) * (9/5) + 32).toFixed(1)}°`;
    feelsTitle.textContent = `FEELS LIKE`;
    feelsDisplay.textContent = `${((feels_like - 273.15) * (9/5) + 32).toFixed(1)}°F`;
    pressureTitle.textContent = `PRESSURE;`
    pressureDisplay.textContent = `${pressure} hPa`;
    humidityTitle.textContent = `HUMIDITY`;
    humidityDisplay.textContent = `${humidity}%`;
    visTitle.textContent = `VISIBILITY`;
    visDisplay.textContent = `${visibility / 1000} km`;
    
    //this block adds classes to our elements, letting us link our css properly
    cityDisplay.classList.add("cityDisplay");
    tempDisplayF.classList.add("tempF");
    tempDisplayC.classList.add("tempC");
    emojiDisplay.classList.add("emoji");
    descDisplay.classList.add("title");
    tempMinMaxDisplay.classList.add("tempHighLow");
    feelsTitle.classList.add("title");
    feelsDisplay.classList.add("value");
    pressureTitle.classList.add("title");
    pressureDisplay.classList.add("value");
    humidityTitle.classList.add("title");
    humidityDisplay.classList.add("value");
    visTitle.classList.add("title");
    visDisplay.classList.add("value");

    //this block appends these elements(children) to their proper parent divs
    cityPlaceholder.appendChild(cityDisplay);
    mainTemp.appendChild(tempDisplayF);
    mainTemp.appendChild(tempDisplayC);
    emojiPlaceholder.appendChild(emojiDisplay);
    subTemp.appendChild(descDisplay);
    subTemp.appendChild(tempMinMaxDisplay);
    box1.appendChild(feelsTitle);
    box1.appendChild(feelsDisplay);
    box2.appendChild(pressureTitle);
    box2.appendChild(pressureDisplay);
    box3.appendChild(humidityTitle);
    box3.appendChild(humidityDisplay);
    box4.appendChild(visTitle);
    box4.appendChild(visDisplay);
}

//function uses switch statement to determine which emoji is used for specific weather ids
function getWeatherEmoji(weatherId) {
    switch(true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌬️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message) {
    const errorDisplay = document.createElement("p"); //creates a paragraph element to display our message
    errorDisplay.textContent = message; //add our message to this new p element
    errorDisplay.classList.add("errorDisplay"); //add our css errorDisplay class to this new p element
    //check if there is an existing error already, to avoid stacking errors
    const existingError = document.querySelector(".errorDisplay");
    if (existingError) {
        existingError.remove();
    }
    //reset the text content if there is text there
    mainTemp.textContent = "";
    subTemp.textContent = "";
    box1.textContent = "";
    box2.textContent = "";
    box3.textContent = "";
    box4.textContent = "";
    cityPlaceholder.textContent = "";
    emojiPlaceholder.textContent = "";
    card.style.display = "flex"; //to display the card
    card.appendChild(errorDisplay); //appends this p element with the error to the card display
}

//clear error function to clear errors if there are any
function clearError() {
    const existingError = document.querySelector(".errorDisplay");
    if (existingError) {
        existingError.remove();
    }
}