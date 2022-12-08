const Item = require("../models/Item");
const axios = require("axios");

// body: name, restaurant_name, price, quantity, time
const testOrderItem = async (req, res) => {
    try {
        // finds the item that matches "name" and "restaurant" in request body
        Item.findOne({ name: req.body.name, restaurant_name: req.body.restaurant_name }).then( async (currentItem) => {
            // if item doesn't exist, simply POST the current item 
            if (currentItem === null) {
                
                // creates an item document to be added based on request body
                const item = new Item({
                    name: req.body.name, 
                    restaurant_name: req.body.restaurant_name, 
                    price: req.body.price, 
                    order_history: [{ date: req.body.time, quantity: req.body.quantity }],
                    quantity: req.body.quantity
                })
                
                // saves the new item document to the database
                item.save((e, document) => {
                    if (e) {
                        console.log(e)
                        res.send('Error in adding Item. Message: ' + e)
                    }
                    else {
                        res.send(item)
                    }
                })
            }
            // if the item exists, we must update the order_history array accordingly
            else {
                // adds the current order to the item's existing order_history
                let new_order_history = currentItem.order_history
                let new_quantity = currentItem.quantity + req.body.quantity
                new_order_history.push({ date: req.body.time, quantity: req.body.quantity })
                const currTime = Date.now()

                // checks in order of oldest first to and removes items older than 48 hours
                while (new_order_history.length > 0 && currTime - new_order_history[0] < 48 * 36e5) {
                    // also makes sure to subtract the amount of items in that order from the total quantity
                    new_quantity -= new_order_history.pop().quantity
                }
                currentItem.order_history = new_order_history
                currentItem.quantity = new_quantity

                // saves the updated order_history and quantity
                await currentItem.save()
                
                // sends the entire item back
                res.send(currentItem)
            }
        })
    }
    catch (e) {
        res.send(e)
    }
}

// body: order -> [{name, price, quantity}], restaurant_name, time
// goes through the body of the order and calls the endpoint associated with orderItem on each item
const testPlaceOrder = async (req, res) => {
    try {
        const restaurant_name = req.body.restaurant_name
        const order = req.body.order
        const time = req.body.time
        const completedOrder = []
        for (const item of order) {
            const orderedItem = await axios.put('http://localhost:3030/testing/item', {name: item.name, restaurant_name: restaurant_name, price: item.price, quantity: item.quantity, time: time})
            .then((res) => res.data)
            completedOrder.push(orderedItem)
        }
        res.send(completedOrder)
    }
    catch (e) {
        console.log(e)
        res.send('Error in placing order. Message: ' + e)
    }
}

module.exports = { testOrderItem, testPlaceOrder }