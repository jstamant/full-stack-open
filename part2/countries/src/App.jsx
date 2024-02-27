import { useState, useEffect } from 'react'

import ListDisplay from './components/ListDisplay'
import Search from './components/Search'

import countriesAPI from './services/restcountries'


const App = () => {
  useEffect(() => {
    countriesAPI.getAll()
      .then(response => setShownCountries(response.data))
  }, [])

  const [shownCountries, setShownCountries] = useState([])
  const [nameFilter, setNameFilter] = useState('')
  const [selectedItem, setSelectedItem] = useState('')

  const handleSelectItem = name => setSelectedItem(name)

  const handleNameFilterEvents = event => {
    setNameFilter(event.target.value)
    setSelectedItem('')
  }

  return (
    <div>
      <h1>Data for Countries</h1>
      <Search value={nameFilter} onChange={handleNameFilterEvents} />
      <ListDisplay
        items={shownCountries}
        filter={nameFilter}
        selected={selectedItem}
        handleSelect={handleSelectItem}
      />
    </div>
  )
}

export default App
