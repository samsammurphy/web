const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        require: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    pointGeometry: {
        type: String,
        require: false

    }
})

module.exports = mongoose.model('user', userSchema)

