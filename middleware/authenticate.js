////////////////////
// new JWT route(s)
const jwt = require('jsonwebtoken');
const accessTokenSecret = "someSecretIJustInvented!";

// Writing our own middleware
const authenticate = (async (req,res,next) =>{
    try{
        // Look at the request to see if it has the token
        const authHeader = req.headers.authorization;
        // authHeader will have something like this
        // Bear tokenpart
        // We need to split
        if (authHeader) {
            const jwtToken = authHeader.split(' ')[1];
            const user = jwt.verify(jwtToken, accessTokenSecret);
            req.user = user;
        }
        else{
            return res.send(403);
        }
    }
    catch(err){
        res.send(403);
    }
    next();
})

module.exports = authenticate;