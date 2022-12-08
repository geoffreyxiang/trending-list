const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    name: String, 
    restaurant_name: String, 
    price: Number, 
    order_history: [{date: Date, quantity: Number}], 
    quantity: Number,
    heuristic_value: Number, 
    page: Number
})

module.exports = mongoose.model('Item', ItemSchema)