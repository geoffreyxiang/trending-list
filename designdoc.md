# Design and Documentation

## Backend (MongoDB, Express.js, Node.js)

### Schema
- Item (the only Model used)
    - **name** (String)- The name of the item (basic property used for finding item)
    - **restaurant_name** (String)- The restaurant that sells the item (basic property used for finding item)
    - **price** (Number) - The price of the item (basic property)
    - **order_history** (Array) - An array-implementation of a Queue that contains the Item's previous orders sorted by oldest first. Each 'order' is a JSON that has 'date' and 'quantity' keys. Getting the last item in this array is helpful for the "last ordered" tag
        - **date** (Date) - The date when the given order was ordered
        - **quantity** (Number) - The amount of the given Item ordered in the given order
    - **quantity** (Number) - The total amount of times an Item was sold. Equivalent to summing up all the 'quantity' keys within the orders in 'order_history,' but keeping track of this saves lots of computation since this value is searched often for tagging purposes
    - **heuristic_value** (Number) - A score given to an Item, which is computed to create an ordering system based on if a given item is trending 
    - **page** (Number) - Represents the page (Set to be a group of 10) that each item is grouped under (post-ordering by heuristic_value). This is only used for pagination purposes that enable infinite scrolling. 

### Routes 
- '/items'
    - **'/' GET** - The main GET endpoint that obtains all the items in the database, removes all orders that older than 48 hours, computes a heuristic value for each item, sorts them based on the heuristic value, and then assigns each a page number
        - This endpoint gets called every time the page refreshes to update all items
    - **'/:page' GET** - The GET endpoint used to enable the infinite scrolling feature. Obtains 10 items given by a page value and returns an array with them. 
        - Endpoint gets called every time the user scrolls to the end of the current list and adds 10 more items
    - **'/' DELETE** (body: name, restaurant_name) - Finds a restaurant given by 'name' and 'restaurant_name' in body of request, then deletes it. 
        - Endpoint gets called every time the quantity attribute of a given Item becomes 0 since it must be then removed from the Trending list. 
    - **'/all' GET** - Simply gets all of the Items. Used ONLY for testing purposes. Due to how the file is structured (the '/:page' GET endpoint preceeds it), this endpoint no longer works. 
        - I will add it was extremely useful when dealing with bugs in the main GET endpoint and in updating/deleting items, thus why I've kept it in the final project to show one of the basic methods I use to debug
    - **'/all' DELETE** - Deletes all of the Items in the database. Also used ONLY for testing purposes. 
        - Every time a randomized test is run, this endpoint should be called first to remove all the Items in the previous test. 
        - This endpoint was also very useful in being able to test specific endpoints before clearing the database
- '/orders'
    - **'/item' PUT** (name, restaurant_name, price, quantity) - If an Item with same name and restaurant_name exists, add an order to order_history with the current date and quantity. Otherwise, create an instance of Item and save it to the database (essentially a POST)
    - **'/' PUT** (order, restaurant) - Calls '/orders/item' PUT endpoint for every item in 'order' (each element in order -> {name, price, quantity}). Essentially simulates placing an order at a given restaurant. 
- '/testing'
    - **'/item' PUT** (name, restaurant_name, price, quantity, time) - Does the exact same thing as '/orders/item' except that it allows for a specific date to be passed in (as opposed to using Date.now()). Used ONLY for testing purposes.
    - **'/' PUT** (order, restaurant_name, time) - Does the exact same thing as '/orders/' except that a custom time can be set for the order. This is the main endpoint used to populate test data. 

### Packages
- express
    - Used to build and run backend server
- body-parser
    - Middeware used alongside express to read in request bodies
- cors
    - Used to enable CORS when running backend server
    - Enables frontend to call backend endpoints without getting blocked by security-related protocols
- axios
    - Used to call endpoints
- random-words
    - Used to generate random words to use as names for items and restaurants

## Frontend (React)
### Components 
- Scroll
    - Has a custom React hook (useScroll.js)
        - Hook handles calling backend API to get the next page of items
    - Lists all the Item components
- Item
    - Displays an item's name, price, restaurant_name, and has two Tags (recent purchase tag and time tag)
- Tag
    - Recent purchase tag
        - Takes in the quantity and displays it
    - Time tag
        - Takes in the order_history and displays how long ago the last order in that array was placed
