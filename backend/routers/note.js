const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const notes = require('../models/notes')
const { body, validationResult } = require('express-validator')

const router = express.Router();



//Fetching notes login required 
router.get('/getnotes', fetchuser, async (req, res) => {
    try {
        const userID = req.user.id
        const Notes = await notes.find({ user: userID })
        console.log(userID)
        res.json(Notes)
        
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"})
    }

})

//Adding new  notes login required  using /addnotes
router.post('/addnotes', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Enter some Description").isLength({min: 5}),  
] ,async (req, res) => {
    try {
        
        const userID = req.user.id
        const {title , description , tag} = req.body
        console.log(userID, title, description, tag)
        const valid_note = validationResult(req)
        if(!valid_note.isEmpty()){
            return res.status(400).json({error : valid_note.array()})
        }
        console.log(valid_note)
        
        const Note = new notes({
            title, description, tag, user : userID,
        })         

        const My_notes = await Note.save(Note)

        res.json(My_notes)
    
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"})
    }
})
module.exports = router