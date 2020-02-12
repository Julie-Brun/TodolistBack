const mongoose = require('mongoose');

let taskSchema = new mongoose.Schema({
    listID:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List'
    }],
    name: {
        type: 'string',
        required: 'You need to specifie a name'
    },
});

module.exports = mongoose.model('Task', taskSchema);