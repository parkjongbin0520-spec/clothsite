const API_KEY = "8576ca6cc1758255ca9250ce92660339";
let currentTemp = 15;

function getWeatherIcon(id) {
    if (id >= 200 && id < 300) return '⛈️';
    if (id >= 300 && id < 400) return '🌦️';
    if (id >= 500 && id < 600) return '🌧️';
    if (id >= 600 && id < 700) return '❄️';
    if (id >= 700 && id < 800) return '🌫️';
    if (id === 800) return '☀️';
    if (id === 801) return '🌤️';
    if (id <= 804) return '⛅';
    return '🌡️';
}

function getWeatherBriefing(temp, weatherId, desc) {
    let clothingMsg;
    if (temp >= 28) clothingMsg = '반팔·반바지가 딱 맞는 날씨예요.';
    else if (temp >= 23) clothingMsg = '얇은 셔츠나 원피스가 좋아요.';
    else if (temp >= 17) clothingMsg = '가벼운 가디건이나 긴소매를 챙기세요.';
    else if (temp >= 12) clothingMsg = '얇은 재킷이나 맨투맨을 입으세요.';
    else if (temp >= 7) clothingMsg = '두꺼운 자켓이나 코트가 필요해요.';
    else clothingMsg = '패딩·두꺼운 코트는 필수예요.';

    let weatherExtra = '';
    if (weatherId >= 200 && weatherId < 300) weatherExtra = ' 천둥번개가 치니 외출에 주의하세요.';
    else if (weatherId >= 300 && weatherId < 600) weatherExtra = ' 우산을 꼭 챙기세요.';
    else if (weatherId >= 600 && weatherId < 700) weatherExtra = ' 눈이 오니 미끄럼에 주의하세요.';
    else if (weatherId >= 700 && weatherId < 800) weatherExtra = ' 시야가 좋지 않아 운전 시 주의하세요.';

    return `${desc} — ${clothingMsg}${weatherExtra}`;
}

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.9780&appid=${API_KEY}&units=metric&lang=kr`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const weather = data.weather[0];
        currentTemp = data.main.temp;

        const headerEl = document.getElementById('weather');
        if (headerEl) headerEl.textContent = `${currentTemp.toFixed(1)}°C · ${weather.description}`;

        const s1Icon = document.getElementById('s1-icon');
        const s1Temp = document.getElementById('s1-temp');
        const s1Desc = document.getElementById('s1-desc');
        const s1Feels = document.getElementById('s1-feels');
        const s1Minmax = document.getElementById('s1-minmax');
        const s1Humidity = document.getElementById('s1-humidity');
        const s1Wind = document.getElementById('s1-wind');
        const s1Location = document.getElementById('s1-location');

        if (s1Icon) s1Icon.textContent = getWeatherIcon(weather.id);
        if (s1Temp) s1Temp.textContent = `${currentTemp.toFixed(1)}°C`;
        if (s1Desc) s1Desc.textContent = getWeatherBriefing(currentTemp, weather.id, weather.description);
        if (s1Feels) s1Feels.textContent = `${data.main.feels_like.toFixed(1)}°C`;
        if (s1Minmax) s1Minmax.textContent = `${data.main.temp_min.toFixed(0)}° / ${data.main.temp_max.toFixed(0)}°C`;
        if (s1Humidity) s1Humidity.textContent = `${data.main.humidity}%`;
        if (s1Wind) s1Wind.textContent = `${data.wind.speed}m/s`;
        if (s1Location) s1Location.textContent = data.name;

    } catch (err) {
        const headerEl = document.getElementById('weather');
        if (headerEl) headerEl.textContent = '날씨 불러오기 실패';
        const s1Desc = document.getElementById('s1-desc');
        if (s1Desc) s1Desc.textContent = '날씨 정보를 불러오지 못했습니다.';
    }
}

getWeather();
