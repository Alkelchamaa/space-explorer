// Get DOM elements for user input and displaying weather information
const fetchWeatherButton = document.getElementById('fetchWeather');
const cityInput = document.getElementById('city');
const cityNameElement = document.getElementById('cityName');
const cityWeatherElement = document.getElementById('cityWeather');
const marsWeatherElement = document.getElementById('marsWeather');
const differenceWeatherElement = document.getElementById('differenceWeather');

// OpenWeatherMap API Key (used for fetching Earth's weather data)
const openWeatherApiKey = '8576cf126b2a89633ae359e73f3431b8';

// NASA API Key (used for fetching Mars weather data)
const nasaApiKey = 'smprpjFm9inmvsruZO88blwm1sFNTEbVNzHCOFbk'; 

/**
 * Fetches the weather data for a given city using the OpenWeatherMap API.
 */
async function fetchCityWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const temp = (data.main.temp - 273.15).toFixed(2); // Convert temperature from Kelvin to Celsius
    const weather = data.weather[0].description;

    // Update the UI elements with the fetched city weather data
    cityNameElement.textContent = `${city} Weather`;
    cityWeatherElement.innerHTML = `
      <strong>Temperature:</strong> ${temp}°C<br>
      <strong>Condition:</strong> ${weather}
    `;

    return parseFloat(temp); // Return the temperature as a number for comparison
  } catch (error) {
    // Handle errors if the API request fails
    cityWeatherElement.innerHTML = 'Failed to fetch city weather data.';
    return null;
  }
}

/**
 * Fetches the latest available Mars weather data from NASA's InSight API.
 */
async function fetchMarsWeather() {
  const url = `https://api.nasa.gov/insight_weather/?api_key=${nasaApiKey}&feedtype=json&ver=1.0`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const sol = data.sol_keys[0]; // Get the latest sol (Martian day) data
    const marsTemp = data[sol].AT.av.toFixed(2); // Average temperature on Mars in Celsius

    // Update the UI elements with Mars weather data
    marsWeatherElement.innerHTML = `
      <strong>Temperature:</strong> ${marsTemp}°C<br>
      <strong>Season:</strong> ${data[sol].Season}
    `;

    return parseFloat(marsTemp); // Return the Mars temperature for comparison
  } catch (error) {
    // Handle errors if the API request fails
    marsWeatherElement.innerHTML = 'Failed to fetch Mars weather data.';
    return null;
  }
}

/**
 * Compares the temperatures of the given city and Mars and displays the difference.
 */
function displayDifference(cityTemp, marsTemp, city) {
  if (cityTemp !== null && marsTemp !== null) {
    const difference = (cityTemp - marsTemp).toFixed(2);
    differenceWeatherElement.innerHTML = `
      <strong>Temperature Difference:</strong> ${difference}°C<br>
      <strong>${city} is ${difference > 0 ? 'warmer' : 'colder'} than Mars.</strong>
    `;
  } else {
    // Display a message if one of the temperatures couldn't be retrieved
    differenceWeatherElement.innerHTML = 'Unable to calculate difference.';
  }
}

// Event listener for the "Fetch Weather" button
fetchWeatherButton.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (city) {
    const cityTemp = await fetchCityWeather(city);
    const marsTemp = await fetchMarsWeather();
    displayDifference(cityTemp, marsTemp, city);
  } else {
    alert('Please enter a city name.');
  }
});

// Automatically fetch Mars weather data when the page loads
fetchMarsWeather();
