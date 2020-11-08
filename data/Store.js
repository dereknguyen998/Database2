const mongoose = require('mongoose');

// Set up a template or something like a class
const StoreSchema = new mongoose.Schema(
    {
        name: String,
        id: Number,
        quanity: Number,
        description: String
    })

// Create an object
const StoreModel = mongoose.model('Store', StoreSchema);

// I want people outside of this file can access the
// AuthorModel
module.exports = StoreModel;