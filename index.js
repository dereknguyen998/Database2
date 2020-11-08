const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');                       // For mongoose database
const port = process.env.PORT || 8080;
const UsersModel = require('./data/Users');
const StoreModel = require('./data/Store');
const CartsModel = require('./data/Carts');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = express.Router();

const store = require('./data/sampleData/sampleStore.json');
// Connect to mongodb cloud server
let database;
const url = 'mongodb+srv://dbUser:dbUserPassword@cluster0.6veqd.mongodb.net/DataBaseProject?retryWrites=true&w=majority' // This is where I keep the URL
//////////////////////////////////////////////////////////////
// This function is being used to connect the database to our
// code.
//
//
//
//
//////////////////////////////////////////////////////////////
const initDataBase = async() => {
    // It takes a while to get the data so that why I use await here
    database = await mongoose.connect(url);

    // Testing to see if the database is successfully connected
    if (database){
        // This part is middleware
        // Everytime you get a request or respond it will go through the session
        app.use(session({
            secret: 'random',
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        app.use(router);
        console.log('Successfully connected to my DB.');
    }
    else{
        console.log('Error connecting to my DB.');
    }
}

//////////////////////////////////////////////////////////////
// This function is used to initialize the user
//
//
//
//
//
//////////////////////////////////////////////////////////////
const initUsers = async() => {
    // 1. Creating an author array
    let Users = []
    const objUsers = require("./data/sampleData/sampleUsers.json");
    let newUser = {};
    for (var i = 0; i < objUsers.length; i++){
        Users.push(objUsers[i]);
        Users[i].login = objUsers[i].firstName + objUsers[i].lastName;
        Users[i].password = 'password1234';
    }
    await UsersModel.create(Users);
}

//////////////////////////////////////////////////////////////
// This function is used to initialize the users' carts
//
//
//
//
//
//////////////////////////////////////////////////////////////
const initCarts = async() => {
    let Carts = [];
    const objCarts = require("./data/sampleData/sampleCarts.json");
    await CartsModel.create(objCarts);
}

const init = async() => {
    await initDataBase();
    await UsersModel.deleteMany({});
    //await CartsModel.deleteMany({});
    await initUsers();
    //await initCarts();
}


init();

router.get('/test', async (req,res) =>{
    const carts = await CartsModel.find({});
    res.send(carts);
})

//Test router for session
router.get('/', async (req,res) =>{
    let obj = {"first:" : "first"};
    if (!req.session.a){
        req.session.a = [obj];
    }
    else{
        let newObj = {"second" : "second"};
        req.session.a.push(newObj);
    }
    res.send(`${JSON.stringify(req.session.a)}`);
})
// routes for 1 and 2
router.use(require('./routes/userRoutes'));

// routes for  3
router.use(require('./routes/cartRoutes'));

// routes for  4
router.use(require('./routes/storeRoutes'));

app.listen(port);




router.post('/user/login', async (req, res) =>{
    const login = req.body.login;
    const password = req.body.password;

    const foundUser = await UsersModel.findOne({login,password});

    if (foundUser){
        // User was found, create a token!
        const accessToken = jwt.sign({user:foundUser}, accessTokenSecret);
        res.send(accessToken);
    }
    else{
        res.send(403);
    }
})

const authenticate = require('./middleware/authenticate');
router.post('/testAuthenticate', authenticate, async (req,res) =>{
    res.send({"Object:" : "Found"});
})

console.log(`listening on port ${port}`);