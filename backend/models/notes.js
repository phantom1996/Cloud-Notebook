const mongoose = require('mongoose');

const {Schema} = mongoose;

const Notes = new Schema({

    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user' 
    },

    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    tag : {
        type : String,
        default : "My Notes"
    },
    date : {
        type: Date,
        default : Date.now
    }
})
const notes = mongoose.model('notes', Notes);

module.exports = notes