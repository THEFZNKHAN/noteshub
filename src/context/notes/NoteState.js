import NoteContext from "./NoteContext";
import { useState } from 'react';

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial);

    // Get All Note
    const getNotes = async () => {
        // API Call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3N2ExMDgyZjhiM2IzNTYwMjk1OTYwIn0sImlhdCI6MTY4NTU2Mzc4MX0.p1au6w6Lmv43tCMcO9w4Dun4lPHscFK9HIGpcFqJf2Y",
            },
        });
        const json = await response.json();
        setNotes(json); // Pass the fetched notes to setNotes
    }

    // Add Note
    const addNote = async (title, description, tag) => {
        // API Call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3N2ExMDgyZjhiM2IzNTYwMjk1OTYwIn0sImlhdCI6MTY4NTU2Mzc4MX0.p1au6w6Lmv43tCMcO9w4Dun4lPHscFK9HIGpcFqJf2Y",
            },
            body: JSON.stringify({ title, description, tag }), // Pass an object to JSON.stringify
        });
        const note = await response.json();
        setNotes(notes.concat(note));
    }

    // Delete Note
    const deleteNote = async (id) => {
        // API Call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3N2ExMDgyZjhiM2IzNTYwMjk1OTYwIn0sImlhdCI6MTY4NTU2Mzc4MX0.p1au6w6Lmv43tCMcO9w4Dun4lPHscFK9HIGpcFqJf2Y",
            },
        });
        const json = response.json();
        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
    }

    // Edit Note
    const editNote = async (id, title, description, tag) => {
        // API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3N2ExMDgyZjhiM2IzNTYwMjk1OTYwIn0sImlhdCI6MTY4NTU2Mzc4MX0.p1au6w6Lmv43tCMcO9w4Dun4lPHscFK9HIGpcFqJf2Y",
            },
            body: JSON.stringify({ title, description, tag }),
        });
        const json = await response.json();

        let newNotes = JSON.parse(JSON.stringify(notes));
        // Logic to edit in client
        for (let index = 0; index < notes.length; index++) {
            const element = notes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;