//lets the user press eneter to start search
document.getElementById('city').addEventListener("keypress", function(event){
    if(event.key == "Enter"){
        event.preventDefault()
        document.getElementById("searchButton").click()
       
    }
})
function getWeather(){
    // OpenWeatherMap api
    const apiKey = '18416d8bf13e27bc464c872da04a60fa'
    const city = document.getElementById('city').value

    //make sure a city is entered
    if(!city){
        alert('Please enter a city')
        return;
    }

    
    //call the api for the current and forecasted weather
    //both of these are deprecated
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

    //get the data for the current weather in the city, if valid call displayWeather method,
    // if not out error message
    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => { 
        displayWeather(data);  
    })
    .catch(error => {
        console.error('Error fetching current weather data: ', error);
        alert('Error fetching current weather data. Please try again.');
    });

    //get the data for the forecasted weather in the city, if valid call displayWeather method,
    // if not out error message
    fetch(forecastWeatherUrl)
    .then(response => response.json())
    .then(data => {
        dispayHourlyForcast(data.list);
    })
    .catch(error =>{
        console.error('Error fetching hourly forecast weather data: ', error);
        alert('Error fetching hourly forecast weather data. Please try again.');
    })

}

//Method that takes in data from the current weather api URL, gets all necessary data
//and displays it
function displayWeather(data){
   
    //set up the variables the 4 main html elements
    const tempDivInfo = document.getElementById('temp-div')
    const weatherInfoDiv = document.getElementById('weather-info')
    const weatherIcon = document.getElementById('weather-icon')
    const hourlyForecastDiv = document.getElementById('hourly-forecast')

    //clear previous content
    tempDivInfo.innerHTML = ' ';
    weatherInfoDiv.innerHTML = ' ';
    hourlyForecastDiv.innerHTML = ' ';

    //if the city is not found
    if(data.cod == '404')
    {
        weatherInfoDiv.innerHTML = `1<p>${data.message}</p>`;
    }else{
        //get city name, current temperature in fahrenheit, description of weather, icon code, and country code
        const cityName = data.name;
        const temperature = Math.round((data.main.temp - 273.15)* 9/5 + 32 );
        const description = data.weather[0].description;//weather is an array
        const iconCode = data.weather[0].icon;
        const countryCode = data.sys.country

        //get and save the weather image
        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

        //display the temperature
        const temperatureHTML = `<p>${temperature}°F</p>`;

        //display city name, country code, and weather description
        const weatherHTML = `<p>${cityName}, ${countryCode}</p> <p>${description}</p>`;

        //set everything equal to their HTML variables
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        //call the method that displays the weather image
        showImage();


    }
}

//Method that takes in data from the forecasted weather api URL, gets all necessary data
function dispayHourlyForcast(hourlyData){

    //set up varible for hourly-forecasted html element
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0,8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();//convert milliseconds to hour
        const temperature = Math.round((item.main.temp - 273.15) * 9/5 + 32 ); // Convert to Fahrenheit
        const iconCode = item.weather[0].icon;//weather is an array, get icon code
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; //get and save image


        //display hourly forecast
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°F</span>
            </div>
        `;
        //add it to the hourly-forecasted html element
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
    }

    //set up html variable for the image, and style the image
    function showImage(){
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.style.display = 'block';
    }


    
