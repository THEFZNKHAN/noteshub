import NoteContext from "./NoteContext";
import { useState } from 'react';

const NoteState = (props) => {
    const s1 = {
        "name": "Faiz",
        "class": "5A"
    }
    const [state, setState] = useState(s1);
    const update = () => {
        setTimeout(() => {
            setState({
                "name": "Faizan",
                "class": "10A"
            })
        }, 1000);
    }

    return (
        <NoteContext.Provider value={{state, update}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;