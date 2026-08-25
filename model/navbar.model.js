const mongoose = require('mongoose')

const navDropdownSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
})

const navbarSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    hasDropDown: {
        type: Boolean,
        default: false
    },
    dropDown: [navDropdownSchema]
})

const navbarModel = mongoose.model("navitem", navbarSchema)

module.exports = navbarModel