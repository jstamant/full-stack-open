import CountryDisplay from './CountryDisplay'


const ListDisplay = ({ items, filter }) => {
  if (items.length == 0) {
    return <p>Fetching data, please wait...</p>
  }
  const filteredItems = items.filter(item => item.name.common.toLowerCase().includes(filter.toLowerCase()))
  if (filteredItems.length > 10) {
    return <p>Too many matches ({filteredItems.length}). Please specify further.</p>
  } else if (filteredItems.length > 1) {
    return (
      <ul>
        {filteredItems
          .map((item) => <li key={item.name.common}>{item.name.common}</li>)}
      </ul>
    )
  } else if (filteredItems.length == 1) {
    return <CountryDisplay country={filteredItems[0]} />
  } else {
    return <p>Invalid country. Please change your filter.</p>
  }
}

export default ListDisplay
