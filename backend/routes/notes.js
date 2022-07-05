const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes')

router.get('/fetchnotes', fetchuser, async (req, resp) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        resp.json(notes)
    } catch (error) {
        console.log(error)
        resp.status(500).send("Internal server occured")
    }
})

router.post('/addnote', fetchuser, [
    body('title', 'Enter valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 10 characters').isLength({ min: 10 })
], async (req, resp) => {
    try {
        const { title, description, tag } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return resp.status(400).json({ errors: errors.array() })
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        resp.json(savedNote)
    } catch (error) {
        console.log(error)
        resp.status(500).send("Internal server occured")
    }
})

router.put('/updatenote/:id', fetchuser, [
], async (req, resp) => {
    const { title, description, tag } = req.body
    const newNote = {}
    try {

        if (title) {
            newNote.title = title
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag
        }
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return resp.status(404).send("Not found")
        }
        if (note.user != req.user.id) {
            return resp.status(401).send("Unauthorized")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        resp.json({ note })
    } catch (error) {
        console.log(error)
        resp.status(500).send("Internal server occured")
    }
})

router.delete('/deletenote/:id', fetchuser, [
], async (req, resp) => {
    try {
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return resp.status(404).send("Not found")
        }
        if (note.user != req.user.id) {
            return resp.status(401).send("Unauthorized")
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        resp.json({ "Success": "Note has been deleted", note: note })
    } catch (error) {
        console.log(error)
        resp.status(500).send("Internal server occured")
    }

})


module.exports = router