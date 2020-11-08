const cartData = require('../data/cartData');

const userData = {
    nextUserId: 50,
    data: require('./sampleData/sampleUsers.json'),

    //Can't use arrow functions for objects or "this" breaks

    //This function adds a user
    create: function(newUser) {
        newUser.id = this.nextUserId++;
        newUser.cartId = cartData.create().id;
        this.data.push(newUser);
        return newUser;
    },

    //This function finds all users
    find: function() {
        return this.data;
    },

    //This function finds a user by ID
    findById: function(userId){
        return this.data.find(user => user.id===userId);
    }
};

module.exports = userData;