const express = require("express");
const router = express.Router();
const { getAllItemsSorted, getSortedItemsPage, deleteItem } = require("../controllers/itemController");

const Item = require("../models/Item");

// Retrieves all items sorted by their heuristic value (which needs to be recalcuated at the time of the call)
router.get("/", getAllItemsSorted);

// Retrieves all items grouped by a given page for infinite scrolling
router.get("/:page", getSortedItemsPage);

// Deletes an item based on name and restaurant given
// Used to delete restaurants from trending list when they have 0 ordered recently
router.delete("/", deleteItem);

/*
*
*
* BELOW ROUTES ARE FOR DEBUGGING PURPOSES 
*
*
*/

// Gets all items
// Doesn't work anymore since "/:page" route is above it
router.get("/all", async (req, res) => {
    try {
        Item.find().then((items) => {
            res.send(items)
        })
    }
    catch (e) {
      res.send('Error in getting all items. Message: ' + e)
    }
})

// Deletes everything
router.delete("/all", async (req, res) => {
    Item.deleteMany({}).then(() => {
        res.send('Deleted all items')
    })
    .catch((e) => {
        res.send('Error deleting all items. Message: ' + e)
    })
})

module.exports = router;