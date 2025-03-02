const fetchWeatherButton = document.getElementById('fetchWeather');
const cityInput = document.getElementById('city');
const cityNameElement = document.getElementById('cityName');
const cityWeatherElement = document.getElementById('cityWeather');
const marsWeatherElement = document.getElementById('marsWeather');
const differenceWeatherElement = document.getElementById('differenceWeather');

// OpenWeatherMap API Key
const openWeatherApiKey = '8576cf126b2a89633ae359e73f3431b8'; // Replace with your OpenWeatherMap API key

// NASA API Key
const nasaApiKey = 'smprpjFm9inmvsruZO88blwm1sFNTEbVNzHCOFbk'; // Replace with your NASA API key

// Fetch City Weather
async function fetchCityWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const temp = (data.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
    const weather = data.weather[0].description;
    cityNameElement.textContent = `${city} Weather`; // Update city name
    cityWeatherElement.innerHTML = `
      <strong>Temperature:</strong> ${temp}°C<br>
      <strong>Condition:</strong> ${weather}
    `;
    return parseFloat(temp); // Return city temperature for comparison
  } catch (error) {
    cityWeatherElement.innerHTML = 'Failed to fetch city weather data.';
    return null;
  }
}

// Fetch Mars Weather
async function fetchMarsWeather() {
  const url = `https://api.nasa.gov/insight_weather/?api_key=${nasaApiKey}&feedtype=json&ver=1.0`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const sol = data.sol_keys[0];
    const marsTemp = data[sol].AT.av.toFixed(2); // Average temperature in Celsius
    marsWeatherElement.innerHTML = `
      <strong>Temperature:</strong> ${marsTemp}°C<br>
      <strong>Season:</strong> ${data[sol].Season}
    `;
    return parseFloat(marsTemp); // Return Mars temperature for comparison
  } catch (error) {
    marsWeatherElement.innerHTML = 'Failed to fetch Mars weather data.';
    return null;
  }
}

// Calculate and Display Difference
function displayDifference(cityTemp, marsTemp, city) {
  if (cityTemp !== null && marsTemp !== null) {
    const difference = (cityTemp - marsTemp).toFixed(2);
    differenceWeatherElement.innerHTML = `
      <strong>Temperature Difference:</strong> ${difference}°C<br>
      <strong>${city} is ${difference > 0 ? 'warmer' : 'colder'} than Mars.</strong>
    `;
  } else {
    differenceWeatherElement.innerHTML = 'Unable to calculate difference.';
  }
}

// Event Listener for Button
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

// Fetch Mars Weather on Page Load
fetchMarsWeather();