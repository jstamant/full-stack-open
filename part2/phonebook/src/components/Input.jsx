const Input = ({ name, number, nameOnChange, numberOnChange, buttonClick }) => {
  return (
    <div>
      <h2>Add contact</h2>
      <form>
        <div>
          <label>name:</label>
          <input
            value={name}
            onChange={nameOnChange}
          />
        </div>
        <div>
          <label>number:</label>
          <input
            value={number}
            onChange={numberOnChange}
          />
        </div>
        <div>
          <button type="submit" onClick={buttonClick}>add</button>
        </div>
      </form>
    </div>
  )
}

export default Input
