import React, { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  code: number;
  isDay: number;
}

/** Map WMO weather code to a simple emoji icon */
function weatherIcon(code: number, isDay: number): string {
  if (code === 0)         return isDay ? '☀' : '🌙';
  if (code <= 3)          return '⛅';
  if (code <= 48)         return '🌫';
  if (code <= 67)         return '🌧';
  if (code <= 77)         return '❄';
  if (code <= 86)         return '🌦';
  return '⛈';
}

/**
 * Self-contained weather pill — fetches from Open-Meteo (free, no API key).
 * Renders nothing on failure or while loading.
 */
export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current_weather=true`
          );
          const data = await res.json();
          const cw = data.current_weather;
          setWeather({ temp: Math.round(cw.temperature), code: cw.weathercode, isDay: cw.is_day });
        } catch { /* fail silently — weather is supplementary */ }
      },
      () => { /* geolocation denied — render nothing */ }
    );
  }, []);

  if (!weather) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.275rem 0.65rem',
        borderRadius: '2rem',
        background: 'rgba(245,240,232,0.06)',
        border: '1px solid rgba(245,240,232,0.08)',
        fontSize: '11px',
        color: 'rgba(245,240,232,0.55)',
        fontWeight: 400,
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ fontSize: '12px', lineHeight: 1 }}>{weatherIcon(weather.code, weather.isDay)}</span>
      <span>{weather.temp}°C</span>
    </div>
  );
}
