const CountryDisplay = ({ country }) => {
  console.log(country)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km<sup>2</sup></p>
      <p style={{marginBottom: 0}}>Languages:</p>
      <ul style={{marginTop: 0}}>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common}'s national flag`} />
    </div>
  )
}

export default CountryDisplay
