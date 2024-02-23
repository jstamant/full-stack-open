import { useState } from 'react'


const Anecdote = ({text, votes}) => {
  return (
    <>
      <blockquote><em>"{text}"</em></blockquote>
      <p>This anecdote has {votes} votes.</p>
    </>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(anecdotes.map(() => 0))
  const [popular, setPopular] = useState(0)
  const popularAnecdote = (votes[popular] == 0) ? <p>No anecdotes have been voted on.</p> : <Anecdote text={anecdotes[popular]} votes={votes[popular]} />

  const selectRandom = () => {
    let newSelection = selected
    // Never selects the same anecdote!
    while (newSelection == selected) newSelection = Math.floor(Math.random() * anecdotes.length)
    setSelected(newSelection)
  }

  const addVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    // Checks to see if there's a new "most popular" anecdote
    if (newVotes[selected] >= newVotes[popular]) {
      setPopular(selected)
    }
    setVotes(newVotes)
  }

  return (
    <>
      <div>
        <h1>Anecdote of the day</h1>
        <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
        <button onClick={addVote}>Vote</button>
        <button onClick={selectRandom}>Random Anecdote</button>
      </div>
      <div>
        <h1>Most Popular Anecdote</h1>
        {popularAnecdote}
      </div>
    </>
  )
}

export default App
