const mongoose = require('mongoose');

// Set up a template or something like a class
const UsersSchema = new mongoose.Schema(
    {
        id: Number,
        firstName: String,
        lastName: String,
        cartId: Number,
        login: String,
        password: String
    })

// Create an object
const UsersModel = mongoose.model('Users', UsersSchema);

// I want people outside of this file can access the
// AuthorModel
module.exports = UsersModel;