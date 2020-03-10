const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    listID:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List'
    }],
    // Pour mettre un rôle admin 
    role: {
        enum : [
            1,
            2
        ],
        type: 'number',
        default: 1
    },
    name: {
        type: 'string',
        required: 'You need to specifie a name'
    },
    email: {
        type: 'string',
        required: 'You need to specifie a email',
        unique: true
    },
    password: {
        type: 'string',
        required: 'You need to specifie a password'
    }
});

module.exports = mongoose.model('User', userSchema);
