const Notification = ({ message }) => {
  const style = {
    color: 'green',
    background: 'lightgrey',
    padding: '1rem',
    border: '5px solid green',
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
