const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [1, 'wrong min length'],
    },
    phonenumber: {
        type: Number,
        required: true,
        maxlength:10,
        validate: {
            validator: function (v) {
                let regex = /^\d{10}$/
                return regex.test(v)
            },
            message: function (v) {
                return `${v.value} is not a valid phone number!`
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema);