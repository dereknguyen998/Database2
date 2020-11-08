const mongoose = require('mongoose');

// Set up a template or something like a class
const CartsSchema = new mongoose.Schema(
    {
        id: Number,
        cartItems: [{
            id : Number,
            storeItemId: Number,
            quantity: Number
        }],
        nextCartItemId: Number
    })

// Create an object
const CartsModel = mongoose.model('Carts', CartsSchema);

// I want people outside of this file can access the
// AuthorModel
module.exports = CartsModel;