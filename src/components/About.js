import React, {useContext} from 'react'
import NoteContext from '../Context/NoteContext';

function About() {

  const a = useContext(NoteContext);

  return (
    <div>
      <h1>This is Your Notebook over the Cloud</h1>
      <h3>My name is {a.S1.name}</h3>
      
    </div>
  )
}

export default About;
