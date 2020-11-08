const express = require('express');
const app = express();
const mongoose = require('mongoose');                       // For mongoose database
const port = process.env.PORT || 8080;
const UsersModel = require('../data/Users');
const StoreModel = require('../data/Store');
const CartsModel = require('../data/Carts');
const cartRouter = express.Router();
app.use(express.json());
const {body, validationResult} = require('express-validator');
const authenticate = require('../middleware/authenticate');


// Validation to enforce POSTman body is correct
// storeItemId
// quantity
const cartValidators = [
    body('storeItemId').isNumeric(),
    body('quantity').isNumeric(),
];

// Supplemental route to get ALL users
cartRouter.get('/cart', authenticate, (req, res) => {
    res.send(cartData.find());
});

///////////////////////////////////////////////////////////
// 3.1 POST/cart/:CartId/cartItem – Add a new item to the cart
cartRouter.post('/cart/:CartId/cartItem', authenticate, cartValidators,
   async (req, res) => {
        // This code validates the post body to make sure it has all the minimum pieces we need to create a user
        if (!validationResult(req).isEmpty()) {
            return res.sendStatus(404);
        }

        // Get the carts object to find the right id
        const carts = await CartsModel.find().lean();
        let index = -1;
        for (var i = 0; i < carts.length; i++)
        {
            if (carts[i].id == req.params.CartId){
                index = i;
                break;
            }
        }
        if (index == -1) {
            return res.sendStatus(404);
        }

        // Create a new cartItem from the body
        let newCartItem = req.body;
        newCartItem.id = carts[index].nextCartItemId;

        let cartItemlist = carts[index].cartItems;
        cartItemlist.push(newCartItem);

        await CartsModel.update({id: req.params.CartId}, {cartItems: cartItemlist});
        await CartsModel.update({id: req.params.CartId}, {nextCartItemId: newCartItem.id + 1});

        res.send(carts[index]);
    }
);

///////////////////////////////////////////////////////////
// 3.2 DELETE /cart/:CartId/cartItem/:cartItemId – Remove an item from the cart
cartRouter.delete('/cart/:CartId/cartItem/:cartItemId', authenticate,async(req, res) => {
    // Find the correct cart
    const carts = await CartsModel.find().lean();
    let index = -1;
    for (var i = 0; i < carts.length; i++)
    {
        if (carts[i].id == req.params.CartId){
            index = i;
            break;
        }
    }
    if (index == -1) {
        return res.sendStatus(404);
    }

    let item_index = -1;
    // Now I have to find the correct item
    for (var i = 0; i < carts[index].cartItems.length; i++){
        if (carts[index].cartItems[i].id == req.params.cartItemId){
            item_index = i;
            break;
        }
    }
    await carts[index].cartItems.splice(item_index, 1);

    let newItemList = carts[index].cartItems;

    // Update the model
    await CartsModel.update({id: req.params.CartId}, {cartItems: newItemList});
    res.send(carts[index]);
});

module.exports = cartRouter;