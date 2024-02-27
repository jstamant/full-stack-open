const Notification = ({ message, error=false }) => {
  let style = error
    ? { color: 'red', borderColor: 'red' }
    : { color: 'green', borderColor: 'green' }
  style = {
    ...style,
    background: 'lightgrey',
    padding: '1rem',
    border: '5px solid',
    borderRadius: 5,
    fontSize: '2rem'
  }

  if (message === null) {
    return null
  } else {
    return (
      <div style={style}>{message}</div>
    )
  }
}

export default Notification
