import { useState } from 'react'

import ContactList from './components/ContactList'
import Input from './components/Input'
import Search from './components/Search'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
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
