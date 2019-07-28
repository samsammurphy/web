const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
    name : {
        type: String,
        require: true
    },
    subscriberToChannel: {
        type: String,
        require: true

    },
    subscribeDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Subscriber', subscriberSchema)

