const mongoose = require('mongoose');

const NotesSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true,
    },
    tag:{
        type:String,
        default: "General"
    },    
    Date:{
        type:Date,
        default: Date.now
    },    
    });

    module.export = mongoose.model('notes', NotesSchema);