const Search = ({ value, onChange }) => {
  return (
    <div>
      <h2>Search and Filter</h2>
      <p>Search phonebook by name:</p>
      <input
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Search
