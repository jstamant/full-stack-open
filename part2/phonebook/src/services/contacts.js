import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newContact => {
  return axios.post(baseUrl, newContact)
}

const deleteContact = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

const update = contact => {
  return axios.put(`${baseUrl}/${contact.id}`, contact)
}

export default { getAll, create, deleteContact, update }
