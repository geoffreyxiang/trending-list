const Item = require("../models/Item");
const axios = require('axios');
const url = 'http://localhost:3030/items'

// goal: barely prioritze recency over quantity
// anything ordered at the same time should be sorted by quantity
// division works pretty well to prioritize recency when dividing the different in minutes between last ordered and now, but it's too drastic for small values
// fix this by rounding diffInMinutes up to nearest increment of 20
function computeHeuristicValue(quantity, orderHistory) {
    if (orderHistory.length === 0) {
        return 0
    }
    let lastItemTime = orderHistory[orderHistory.length - 1].date
    let diffInMinutes = Math.floor((Date.now() - Date.parse(lastItemTime)) / (1000 * 60))
    let roundedDiff = Math.ceil(diffInMinutes / 20) * 20
    // heavily impacts any item with less than a minimum threshold (should be less than average) -> hard set to 10
    if (quantity < 10) {
        return quantity - roundedDiff / 20
    }
    return quantity + 48 * 60 / roundedDiff
}

// gets all the items and sorts by heuristic
// must also reupdate the order_history based on the current time as well as the heuristic_value since it is dependent on order_history
const getAllItemsSorted = async (req, res) => {
    try {
        // gets all the items
        Item.find().then(async (items) => {
            itemsArray = []
            for (const item of items) {
                let new_order_history = item.order_history
                let new_quantity = item.quantity
                const currTime = Date.now()
                
                // checks in order of oldest first to and removes items older than 48 hours
                while (new_order_history.length > 0 && currTime - new_order_history[0].date > 48 * 36e5) {
                    new_quantity -= new_order_history.shift().quantity
                }
                
                // finishes the process of updating order_history
                item.order_history = new_order_history
                
                // delete item if the quantity is 0
                if (new_quantity === 0) {
                    await axios.delete(url, {data: {name: item.name, restaurant_name: item.restaurant_name}})
                    continue
                }

                // computes and updates heuristic_value based on new order_history (also updates quantity)
                const new_heuristic_value = computeHeuristicValue(new_quantity, new_order_history)
                item.heuristic_value = new_heuristic_value
                item.quantity = new_quantity
                await item.save()

                // adds the "processed" item to itemArray
                itemsArray.push(item)
            }
            // sort by heuristic (larger values mean more popular, so we want sorting function to make larger values be considered "small")
            itemsArray.sort((x, y) => {return y.heuristic_value - x.heuristic_value})

            // create a page system every 10 sorted items to allow for infinite scrolling
            i = 0
            for (let item of itemsArray) {
                item.page = Math.floor(i / 10) + 1
                i++
                await item.save()
            }
            res.send(itemsArray)
        })
    }
    catch (e) {
        res.send('Error in getting all items (sorted). Message: ' + e)
    }
}

// body: page
// will be called after items are already sorted, so no need to resort
const getSortedItemsPage = async (req, res) => {
    const page = req.params.page
    try {
        Item.find({page: page}).then((items) => {
            if (items === null) {
                res.send([])
            }
            else {
                items.sort((x, y) => {return y.heuristic_value - x.heuristic_value})
                res.send(items)
            }
        })
    }
    catch (e) {
        res.send('Error in getting page of items. Message: ' + e)
    }
    
}

// body: name, restaurant_name
const deleteItem = async (req, res) => {
    Item.findOneAndDelete({name: req.body.name, restaurant_name: req.body.restaurant_name})
    .then((item) => {
        res.send(item)
    })
    .catch((e) => {
        console.log(e)
        res.send('Failed to delete item. Message: ' + e)
    })
}

module.exports = { getAllItemsSorted, getSortedItemsPage, deleteItem }