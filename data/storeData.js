const storeData = {
    nextstoreId: 50,
    data: require('./sampleData/sampleStore.json'),
    //Can't use arrow functions for objects or "this" breaks

    //This function finds a storeItem
    find: function() {
        return this.data;
    },

    //This function finds a storeItem by ID
    findById: function(storeId){
        return this.data.find(store => store.id===storeId);
    }
};

module.exports = storeData;