// run this file to populate database with randomized test data (cd into backend directory and run 'node randomizedTesting.js')
// also make sure the backend server is running first!
// to customize tests, scroll to the very bottom of this file (or to line 109)

const randomWords = require('random-words');
const axios = require('axios');
const url = 'http://localhost:3030'


async function clearDatabase() {
    const res = await axios.delete(url + '/items/all').then((res) => res.data)
}

// not listed in tests below since it is already accounted for with 'populateDatabase' test
// populates database with random values given 5 parameters
// Extremely unlikely to ever update a given item (it would have to generate the same random restaurant name and food name for two given items)
// Based on many tests, it looks like the random word generator doesn't generate that many new words, leading to there being quite a few duplicates on large inputs
async function populateWithOrderRouteNoUpdate(numRestaurants, maxOrders, maxOrderSize, maxPrice, maxQuantity) {
    for (let i = 0; i < numRestaurants; i++) {
        let restaurantName = 'Restaurant ' + randomWords()
        let numOrders = Math.floor(Math.random() * maxOrders) + 1
        for (let j = 0; j < numOrders; j++) {
            let orderSize = Math.floor(Math.random() * maxOrderSize) + 1
            let order = []
            for (let k = 0; k < orderSize; k++) {
                let foodName = 'Food ' + randomWords()
                let price = Math.round(Math.random() * maxPrice * 100) / 100
                let quantity = Math.floor(Math.random() * maxQuantity) + 1
                order.push({name: foodName, price: price, quantity: quantity})
            }
            await axios.put(url + '/orders', {order: order, restaurant_name: restaurantName})
        }
    }
}

// creates an item that is 10 seconds away from being too old to keep in order_history
// works --> after waiting 10 seconds and reloading, the item's tags update accordingly
async function createAlmostTooOldItem() {
    let foodName = "Food " + randomWords()
    let restaurantName = "Restaurant " + randomWords()
    let price = Math.round(Math.random() * 10 * 100) / 100
    let quantity = 1
    let date = Date.now() - 48 * 36e5 + 10000
    await axios.put(url + '/testing/item', {name: foodName, restaurant_name: restaurantName, price: price, quantity: quantity, time: date})
}

// creates an item that is ordered many times, with an extra 1 order being within 10 seconds of becoming older than 48 hours
// after 10 seconds, the item should decrease its quantity by 10 if numExtraOrders > 0
async function createItemWithAlmostTooOldOrder(numExtraOrders) {
    let foodName = "Food " + randomWords()
    let restaurantName = "Restaurant " + randomWords()
    let price = Math.round(Math.random() * 10 * 100) / 100
    let quantity = 10
    let date = Date.now() - 48 * 36e5 + 10000
    await axios.put(url + '/testing/item', {name: foodName, restaurant_name: restaurantName, price: price, quantity: quantity, time: date})
    for (let i = 0; i < numExtraOrders; i++) {
        date = generateDate()
        quantity = Math.ceil(Math.random() * 10)
        await axios.put(url + '/testing/item', {name: foodName, restaurant_name: restaurantName, price: price, quantity: quantity, time: date})
    }
}

async function createManyItemsWithAlmostTooOldOrder(numItems, numExtraOrders) {
    for (let i = 0; i < numItems; i++) {
        createItemWithAlmostTooOldOrder(numExtraOrders)
    }
}


// generates a random date between start and end
function randomDate(start, end) {
    return start + Math.floor(Math.random() * (end - start))
}

// generates a random date between Date.now() and 48 hours before Date.now()
function generateDate() {
    let start = Date.now()
    let end = start - 48 * 36e5
    return randomDate(start, end)
}

// best function to use to create random entries
// generates random dates with each order
async function populateDatabase(numRestaurants, ordersPerRestaurant, orderSize, maxPrice, maxQuantity) {
    // must pre-generate dates since they must be added in order for 48-hr filtering to work properly (built to simulate real world)
    let dates = []
    for (let i = 0; i < numRestaurants * ordersPerRestaurant; i++) {
        dates.push(generateDate())
    }
    // older dates will be smaller integers --> sorted from oldest to most recent
    dates.sort()
    for (let i = 0; i < numRestaurants; i++) {
        let restaurantName = 'Restaurant ' + randomWords()
        for (let j = 0; j < ordersPerRestaurant; j++) {
            let order = []
            for (let k = 0; k < orderSize; k++) {
                let foodName = 'Food ' + randomWords()
                let price = Math.round(Math.random() * maxPrice * 100) / 100
                let quantity = Math.floor(Math.random() * maxQuantity) + 1
                order.push({name: foodName, price: price, quantity: quantity})
            }
            // take the oldest date from the dates array
            let date = dates.shift()
            await axios.put(url + '/testing', {order: order, restaurant_name: restaurantName, time: date})
        }
    }
}

// this is the function that will be called to run a test
// instructions for each test are provided within the body
async function test() {
    // clears database before populating it with new data given by tests below
    await clearDatabase().then(() => console.log('Done Clearing'))

    /*
    - TESTS ARE LISTED OUT BELOW. TESTS WILL WORK IF MANY ARE UNCOMMENTED, BUT FOR BEST RESULTS, ONLY LEAVE ONE UNCOMMENTED AT A TIME
    - when uncommenting tests, uncomment the line starting with 'await' keyword
    - each test will have a description and expected result written above it
    - GENERAL NOTES ABOUT ALL TESTS
        - All Item names will have the structure "Food (Randomly Generated Word)"
        - All Restaurant names will have the structure "Restaurant (Randomly Generated Word)"
        - Any function with parameter inputs can be modified (test your own parameters)
    */


    /* 
        THIS TEST HANDLES AN IMPORTANT EDGE CASE
        createAlmostTooOldItem populates the database with 1 order of 1 item with a random name and random restaurant name

        Expected behavior: Upon entering (refreshing) the page, an item will appear on the app with price randomly generated from 
        1 - 10 and quantity set to 1 
        After roughly 10 seconds (it may vary by a few seconds), refresh the page.
        The item should be gone and there should be a blank list. 
    */
    // await createAlmostTooOldItem().then(() => console.log('Created Item set to expire in 10 seconds'))
    

    /* 
        THIS TEST HANDLES ANOTHER IMPORTANT EDGE CASE (builds on previous edge case)
        createManyItemsWithAlmostTooOldOrder takes in 2 parameters (numItems, numExtraOrders) and populates the database with 
        'numExtraOrders' orders of 'numItems' items with a random name and random restaurant name. 
        For EACH item, there will be one extra order that is added that will expire in 10 seconds and has a quantity value set to 10. 

        Expected behavior: Upon entering (refreshing) the page, 'numItems + 1' items will appear on the app with price 
        randomly generated from 1 - 10 and quantity randomly generated
        After roughly 10 seconds (it may vary by a few seconds), refresh the page.
        All items should still be there. 
        Each item's quantity should have decreased by 10 (to account for the order that turned more than 48 hours old)

        Note: In the extremely unlikely event that the random date function generated a date withina few seconds of 48 hours 
        before Date.now(), there may be eiher deletions or extra quantity changes - if this happens, rerun test for consistent results 
    */
    // await createManyItemsWithAlmostTooOldOrder(4, 3).then(() => console.log('Created Many Items with each having one order expiring in 10 seconds'))
    
    /*
        THIS TEST SHOULD BE THE DEFAULT TEST FOR POPULATING THE DATABASE (hence why it is uncommented right now)
        populateDatabase takes in 5 parameters (numRestaurants, ordersPerRestaurant, orderSize, maxPrice, maxQuantity)
        - numRestaurants = number of restaurants
        - ordersPerRestaurant = number of orders to generate per restaurant
        - orderSize = number of items ordered per order
        - maxPrice = maximum price (will be randomly generated from 0-maxPrice)
        - maxQuantity = maximum quantity of an item in a given order (will be randomly generated from 0-maxQuantity)
        This test allows for customization of almost everything (dates will be randomly generated per order from Date.now() to 48 hours
        before Date.now()). 

        Expected behavior: Populates database with items generated from the 5 parameters given. Generally no special behavior here.

        Note: Since this will simulate ALL orders, depending on input size, this may take a long time to finish running. 
        Time complexity: O(numRestaurants * ordersPerRestaurant * orderSize * O(PUT)). 
        The test I provide takes my laptop roughly 30 seconds to finish running. After database is populated, the message
        'Done populating values' will appear in terminal window
        Also due to how large some inputs can be, the page may need to be refreshed a few times before the output is displayed. Generally,
        refreshing after 5-10 seconds after the first refresh will allow the page to render properly
    */
    await populateDatabase(50, 10, 10, 10, 200).then(() => console.log('Done populating values'))
}

// FOR INSTRUCTIONS, READ STARTING FROM THE test() FUNCTION (FUNCTION IS DEFINED RIGHT ABOVE HERE - line 108)
test()