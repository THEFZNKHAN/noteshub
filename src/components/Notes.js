import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import NoteContext from "../context/notes/NoteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";

const Notes = (props) => {
    const context = useContext(NoteContext);
    let history = useHistory();
    const { notes, getNotes, editNote } = context;

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getNotes();
        } else {
            history.push("/login");
        }
        // eslint-disable-next-line
    }, []);

    const ref = useRef(null);
    const refClose = useRef(null);

    const [note, setNote] = useState({
        id: "",
        etitle: "",
        edescription: "",
        etag: "",
    });

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag,
        });
    };

    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag);
        refClose.current.click();
        props.showAlert("Updated Successfully", "success");
    };

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button
                ref={ref}
                type="button"
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                Launch demo modal
            </button>
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                {/* ... (modal code remains the same) */}
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row my-3">
                        <h2>Your Notes</h2>
                        <div className="container mx-2">
                            {notes.length === 0 && "No notes to display"}
                        </div>
                        {Array.isArray(notes) && notes.length > 0
                            ? notes.map((note) => (
                                  <NoteItem
                                      key={note._id}
                                      updateNote={updateNote}
                                      showAlert={props.showAlert}
                                      note={note}
                                  />
                              ))
                            : notes && <p>Loading notes...</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notes;
