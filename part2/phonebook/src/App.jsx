import { useState, useEffect } from 'react'

import ContactList from './components/ContactList'
import Input from './components/Input'
import Notification from './components/Notification'
import Search from './components/Search'

import contactService from './services/contacts'


const App = () => {
  useEffect(() => {
    contactService
      .getAll()
      .then(response => setPersons(response.data))
  }, [])

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationIsError, setNotificationIsError] = useState(false)

  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleNameFilterChange = event => setNameFilter(event.target.value)

  const handleClick = event => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    if (person) {
      if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)) {
        contactService
          .update({ ...person, number: newNumber })
          .then(response => {
            setPersons(persons.map(person => person.id !== response.data.id ? person : response.data))
            displayNotification(`Updated ${response.data.name} successfully`)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            displayNotification(`Error: ${person.name} does not exist, anymore`, error=true)
          })
      }
    } else {
      contactService
        .create({ name: newName, number: newNumber })
        .then(response => {
          setPersons(persons.concat(response.data))
          displayNotification(`Added ${response.data.name} successfully`)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDelete = id => {
    const { name } = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${name}?`)) {
    contactService
      .deleteContact(id)
      .then(response => {
        setPersons(persons.filter(person => person.id != id))
      })
    }
  }

  const displayNotification = (message, error=false) => {
    setNotificationMessage(message)
    error ? setNotificationIsError(true) : setNotificationIsError(false)
    setTimeout(() => setNotificationMessage(null), 5000)
  }

  return (
    <div>
      <h1>Phonebook App</h1>
      <Notification message={notificationMessage} error={notificationIsError} />
      <Search value={nameFilter} onChange={handleNameFilterChange} />
      <Input
        name={newName} nameOnChange={handleNameChange}
        number={newNumber} numberOnChange={handleNumberChange}
        buttonClick={handleClick}
      />
      <ContactList contacts={persons} filter={nameFilter} onDelete={handleDelete} />
    </div>
  )
}

export default App
