import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const get = (lattitude, longitude) => {
  const api_key = import.meta.env.VITE_WEATHER_KEY
  return axios.get(`${baseUrl}?lat=${lattitude}&lon=${longitude}&appid=${api_key}&units=metric`)
}

export default { get }
