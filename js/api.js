const API_KEY = "8576ca6cc1758255ca9250ce92660339";
let currentTemp = 15;

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.9780&appid=${API_KEY}&units=metric&lang=kr`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const weather = data.weather[0].description;
        currentTemp = data.main.temp;
        document.getElementById('weather').textContent = `${currentTemp.toFixed(1)}°C · ${weather}`;
    } catch (err) {
        document.getElementById('weather').textContent = '날씨 불러오기 실패';
    }
}

getWeather();
