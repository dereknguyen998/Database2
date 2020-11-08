const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');                       // For mongoose database
const port = process.env.PORT || 8080;
const UsersModel = require('../data/Users');
const StoreModel = require('../data/Store');
const CartsModel = require('../data/Carts');
const storeRouter = express.Router();
const {body, validationResult} = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const authenticate = require('../middleware/authenticate');



///////////////////////////////////////////////////////////
// 4.1: GET /StoreItem/:StoreItemID – Get the store item’s details
storeRouter.get('/StoreItem/:StoreItemID', authenticate, async(req, res) => {
    /*
    const stores = await StoreModel.find().lean();
    let index = -1;
    for (var i = 0; i < stores.length; i++)
    {
        if (stores[i].id == req.params.StoreItemID){
            index = i;
            break;
        }
    }
    if (index == -1){
        return res.sendStatus(404);
    }

    res.send(stores[index]);
    */

    const foundItem = await StoreModel.findOne({id: req.params.StoreItemID});
    if (!req.session.a){
        req.session.a = [foundItem];
    }
    else{
        req.session.a.push(foundItem);
    }
    res.send(foundItem);
});


///////////////////////////////////////////////////////////
// 4.2 GET /StoreItem?query=abc – Get all items that satisfy the regular expression query (or all items if no query)
storeRouter.get('/StoreItem', authenticate, async(req, res) => {
    let stores = await StoreModel.find().lean();
    if (req.query.query) {
        const re = new RegExp(req.query.query);
        // We will search for names and descriptions, using regular expressions
        stores = stores.filter(store => {
            return re.test(store.description)
            || re.test(store.name);
        })
    }
    res.send(stores);
});



/////////////////////////////////////////////////////////////////////
// 4.3 Get /StoreItem/Recent?numb=10 Get up to 10 last viewed items
storeRouter.get('/StoreItemRecent', authenticate, async(req, res) => {
   let list = req.session.a;
   let newList = [];
   let lastElement;
   for (var i = list.length - 1; i > list.length - 1 - req.query.numb; i--){
       lastElement = list[i];
       newList.push(lastElement);
   }
   res.send(newList);
})
module.exports = storeRouter;

