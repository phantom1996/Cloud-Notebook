const mongoose = require('mongoose');

const Notes = new Schema({
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

module.exports = mongoose.model('notes', Notes);