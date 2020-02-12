const mongoose = require('mongoose');

let listSchema = new mongoose.Schema({
    userID:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    taskID:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List'
    }],
    name: {
        type: 'string',
        required: 'You need to specifie a name'
    },
    date: {
        type: 'date',
        default: Date.now()
    }
});

module.exports = mongoose.model('List', listSchema);