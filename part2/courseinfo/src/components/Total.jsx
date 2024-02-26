const Total = ({ parts }) => {
  const total = parts.reduce((acc, part) => acc + part.exercises, 0)
  return <p><strong>Total number of exercises: {total}</strong></p>
}

export default Total
