import React, { useState, useContext } from 'react'
import notecontext from "../context/Notes/NoteContext";

export const AddNote = () => {
    const context = useContext(notecontext)
    const {addNote} = context
    const [ note, setNote ] = useState({title: "", description: "", tag: ""})
    const handleClick = (e) => {
        e.preventDefault()
        addNote(note.title, note.description, note.tag)
        setNote({title: "", description: "", tag: ""})
    }
    const onChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }
    return (
        <div>
            <div className="container">
                <h1>Add a Note</h1>
                <form>
                    <div className="mb-3">
                        <label forhtml="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onChange} value={note.title} minLength={5} required/>
                    </div>
                    <div className="mb-3">
                        <label forhtml="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name='description' onChange={onChange} value={note.description}  minLength={5} required/>
                    </div>
                    <div className="mb-3">
                        <label forhtml="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name='tag' onChange={onChange} value={note.tag}  minLength={5} required/>
                    </div>
                    <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary my-3" onClick={handleClick}>Add note</button>
                </form>
            </div>
        </div>
    )
}
