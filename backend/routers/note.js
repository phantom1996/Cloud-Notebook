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


//Updating notes login required  using /updatenote:id
router.put('/updatenote/:id', fetchuser ,async (req, res) => {
    try {
        const userID = req.user.id
        const {title , description, tag} = req.body

        const note_Exist = await notes.findById(req.params.id)
        if(!note_Exist){
            return req.status(400).json({error : "Please Update a valid note"})
        }
        const note_belongtoUser = note_Exist.user.toString()
        if(userID !== note_belongtoUser){
            return req.status(401).json({error : "UnAuthorized Access"})
        }

        const newnote = {}

        if(title){
            newnote.title = title
        }
        if(description){
            newnote.description = description
        }
        if(tag){
            newnote.tag =tag   
        }

        const updatedNote = await notes.findByIdAndUpdate(req.params.id , {$set : newnote}, {new:true}) 
        res.json({updatedNote})
  
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"})
    }
})


module.exports = router