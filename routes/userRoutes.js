const userData = require('../data/userData');
const cartData = require('../data/cartData');
const authenticate = require('../middleware/authenticate');
const express = require('express');
const app = express();
const {body, validationResult} = require('express-validator');
const userRouter = express.Router();
app.use(express.json());
UsersModel = require('../data/Users');
CartsModel = require('../data/Carts');

// Validation to enforce POSTman body is correct
// firstName
// lastName
// email
const userValidators = [
    body('firstName').isAlpha(),
    body('lastName').isAlpha(),
    body('email').isEmail(),
];


// Supplemental route to get ALL users
userRouter.get('/user', authenticate, async (req, res) => {
    const users = await UsersModel.find().lean();
    res.send(users);
});


///////////////////////////////////////////////////////////
// 1.1: GET /user/:UserId – Gets the user info given the id
userRouter.get('/user/:UserId', authenticate, async(req, res) => {
    const users = await UsersModel.find().lean();
    let index = -1;
    for (var i = 0; i < users.length; i++)
    {
        if (users[i].id == req.params.UserId){
            index = i;
            break;
        }
    }
    if (index == -1){
        return res.sendStatus(404);
    }
    res.send(users[index]);

});



///////////////////////////////////////////////////////////
// 1.2 POST/user – Creates a new user
userRouter.post('/user', authenticate,
    async (req, res) => {
    // This code validates the post body to make sure it has all the minimum pieces we need to create a user
        const users = await UsersModel.find().lean();
        const carts = await CartsModel.find().lean();
        let nextUserId = users.length;
        let nextCartId = carts.length;
        let newUser = req.body;
        newUser.id = nextUserId+1;
        const newCart = {
            id: nextCartId+1,
            nextCartItemId: 0,
            cartItems: []
        }
        newUser.cartId = newCart.id;
        UsersModel.create(newUser);
        CartsModel.create(newCart);
        res.send(newUser);
    }
);

///////////////////////////////////////////////////////////
// 2.1 GET /user/:UserId/cart Gets the user’s cart
userRouter.get('/user/:UserId/cart', authenticate, async(req, res) => {
    //find the user
    const users = await UsersModel.find().lean();
    const carts = await CartsModel.find().lean();
    let index = -1;
    for (var i = 0; i < users.length;i++){
        if(users[i].id == req.params.UserId){
            index = i;
            break;
        }
    }
    if (index == -1) {
        return res.sendStatus(404);
    }
    let cart_index = -1;
    //find the users cart, or send a 404
    for (var i = 0; i < carts.length; i++){
        if(users[index].cartId == carts[i].id){
            cart_index = i;
            break;
        }
    }
    if (index == -1){
        return res.sendStatus(404);
    }
    res.send(carts[cart_index]);
});

///////////////////////////////////////////////////////////
//2.2 DELETE /user/:UserId/cart  – Empties the user’s cart
userRouter.delete('/user/:UserId/cart', authenticate, async(req, res) => {
    //find the user
    const users = await UsersModel.find().lean();
    const carts = await CartsModel.find().lean();
    let index = -1;
    for (var i = 0; i < users.length;i++){
        if(users[i].id == req.params.UserId){
            index = i;
            break;
        }
    }
    if (index == -1) {
        return res.sendStatus(404);
    }
    let cart_index = -1;
    //find the users cart, or send a 404
    for (var i = 0; i < carts.length; i++){
        if(users[index].cartId == carts[i].id){
            cart_index = i;
            break;
        }
    }
    if(cart_index == -1){
        res.sendStatus(404);
    }
    let cart = await CartsModel.findByIdAndDelete({id : users[index].cartId}, {cartItems: []});
    res.send(carts[cart_index]);
});

module.exports = userRouter;