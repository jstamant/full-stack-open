import Person from './Person'

const ContactList = ({ contacts, filter, onDelete }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {contacts
          .filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
          .map((person) => <Person person={person} key={person.name} onDelete={() => onDelete(person.id)} />)}
      </ul>
    </div>
  )
}

export default ContactList
