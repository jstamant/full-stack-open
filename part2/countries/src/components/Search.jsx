const Search = ({ value, onChange }) => {
  return (
    <div>
      <p>Search for country by name:</p>
      <input
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Search
