const cartData = {
    nextCartId: 50,
    data: require('./sampleData/sampleCarts.json'),
    //Can't use arrow functions for objects or "this" breaks
    create: function() {
        const newCart = {
            id: this.nextCartId++,
            nextCartItemId: 0,
            cartItems: []
        }
        this.data.push(newCart);
        return newCart;
    },
    find: function() {
        return this.data;
    },
    findById: function(cartId){
        return this.data.find(cart => cart.id===cartId);
    }
};

module.exports = cartData;