import axios from 'axios'
import { useState, useEffect } from 'react'

import ContactList from './components/ContactList'
import Input from './components/Input'
import Search from './components/Search'


const App = () => {
  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }, [])

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleNameFilterChange = (event) => setNameFilter(event.target.value)

  const handleClick = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      window.alert(`${newName} is already added to the phonebook`)
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }))
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h1>Phonebook App</h1>
      <Search value={nameFilter} onChange={handleNameFilterChange} />
      <Input
        name={newName} nameOnChange={handleNameChange}
        number={newNumber} numberOnChange={handleNumberChange}
        buttonClick={handleClick}
      />
      <ContactList contacts={persons} filter={nameFilter} />
    </div>
  )
}

export default App
