import { useState, useEffect } from 'react'

import weatherAPI from '../services/weather'

const CountryDisplay = ({ country }) => {
  useEffect(() => {
    if (country) {
      weatherAPI
        .get(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
        .then(response => setWeather(response.data))
        .catch(error => setWeather(error))
    }
  }, [country])

  const [weather, setWeather] = useState(null)

  let weatherSection = <p>Fetching weather data. Please wait...</p>
  if (weather instanceof Error) {
    weatherSection =
      <>
        <p>An error has occurred while fetching weather data:</p>
        <p>{weather.name} {weather.code} - {weather.message}</p>
      </>
  } else if (weather != null) {
    weatherSection =
      <>
        <p>Temperature: <strong>{weather.main.temp}°C</strong>, feels like {weather.main.feels_like}°C</p>
        <p>Wind: {weather.wind.speed}m/s, gusting to {weather.wind.gust}m/s</p>
        <p>Conditions: <em>{weather.weather[0].description}</em></p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
        <p>Recording location: {weather.name}</p>
      </>
  }

  if (!country) {
    return null
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km<sup>2</sup></p>
      <p style={{marginBottom: 0}}>Languages:</p>
      <ul style={{marginTop: 0}}>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common}'s national flag`} />
      <h2>Weather in {country.capital} now</h2>
      {weatherSection}
    </div>
  )
}

export default CountryDisplay
