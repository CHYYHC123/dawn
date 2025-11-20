import { useState, useEffect } from 'react';

interface WeatherInfo {
  icon: string;
  desc: string;
}

function weatherCodeToInfo(code: number): WeatherInfo {
  const map: Record<number, WeatherInfo> = {
    0: { icon: 'wi wi-day-sunny', desc: 'Clear sky' },
    1: { icon: 'wi wi-day-sunny-overcast', desc: 'Mainly clear' },
    2: { icon: 'wi wi-day-cloudy', desc: 'Partly cloudy' },
    3: { icon: 'wi wi-cloudy', desc: 'Overcast' },
    45: { icon: 'wi wi-fog', desc: 'Fog' },
    48: { icon: 'wi wi-fog', desc: 'Depositing rime fog' },
    51: { icon: 'wi wi-sprinkle', desc: 'Drizzle light' },
    61: { icon: 'wi wi-rain', desc: 'Rain slight' },
    80: { icon: 'wi wi-showers', desc: 'Rain showers slight' },
    95: { icon: 'wi wi-thunderstorm', desc: 'Thunderstorm' },
    99: { icon: 'wi wi-thunderstorm', desc: 'Thunderstorm with hail' }
  };
  return map[code] || { icon: 'wi wi-na', desc: 'Unknown' };
}

interface WeatherTimeResult {
  city: string;
  temp: number;
  desc: string;
  icon: string;
  weathercode: number;
  is_day: number;
  temperature: string;
  winddirection: string;
  windspeed: string;
  ip: string;
}

const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 小时

export function useWeatherTime(): WeatherTimeResult | null {
  const [data, setData] = useState<WeatherTimeResult | null>(null);

  const loadData = async () => {
    try {
      // IP 定位服务
      const ipRes = await fetch('https://freegeoip.app/json/');
      const ipData = await ipRes.json();

      // 天气 API
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current_weather=true`;
      const wRes = await fetch(weatherUrl);
      const weatherData = await wRes.json();

      const weatherInfo = weatherCodeToInfo(weatherData.current_weather.weathercode);

      const result: WeatherTimeResult = {
        city: ipData.city,
        temp: Math.round(weatherData.current_weather.temperature),
        weathercode: weatherData.current_weather.weathercode,
        is_day: weatherData.current_weather.is_day,
        icon: weatherInfo.icon,
        desc: weatherInfo.desc,
        temperature: weatherData.current_weather_units.temperature,
        winddirection: weatherData.current_weather_units.winddirection,
        windspeed: weatherData.current_weather_units.windspeed,
        ip: ipData?.ip
      };

      // 缓存
      localStorage.setItem('weather_cache', JSON.stringify(result));
      localStorage.setItem('weather_cache_time', Date.now().toString());

      setData(result);
    } catch (err) {
      console.error('加载天气失败：', err);
    }
  };

  // 获取当前 IP
  async function getCurrentIP() {
    const res = await fetch('https://api64.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  }

  useEffect(() => {
    // 读取缓存
    const cache = localStorage.getItem('weather_cache');
    const cacheTime = localStorage.getItem('weather_cache_time');

    let currentIP = null;
    (async () => {
      currentIP = await getCurrentIP();
    })();

    if (cache && cacheTime) {
      // ⭐ 本机时区变了 → 说明位置（可能）变了，强制刷新天气
      const cached = JSON.parse(cache) as WeatherTimeResult;
      if (cached.ip !== currentIP) {
        loadData();
        return;
      }

      const age = Date.now() - parseInt(cacheTime);
      if (age < CACHE_DURATION) {
        setData(JSON.parse(cache));
      } else {
        loadData();
      }
    } else {
      loadData();
    }

    // 每 2 小时自动刷新一次
    const interval = setInterval(loadData, CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  return data;
}
