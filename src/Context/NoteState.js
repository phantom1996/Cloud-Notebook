import React, { useState } from 'react';
import NoteContext from './NoteContext';
const NoteState = (props)=>{
    let S1={
        "name" : "Sharad",
        "class" : "12A"
    }
    
    const [state, setState] = useState(S1)


    const Update= ()=>{
        setTimeout(() => {
            setState({
                "name" : "Gopal",
                "class" : "10B"
            })
        }, 2000);
    }

    return(
        <NoteContext value={{S1, Update}}>
            {props.children}
        </NoteContext>
    )
}
export default NoteState;
