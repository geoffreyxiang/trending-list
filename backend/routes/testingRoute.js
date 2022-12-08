const express = require("express");
const router = express.Router();

const { testOrderItem, testPlaceOrder } = require("../controllers/testingController");

// copy of orderController endpoint, but will allow for custom Date input for testing
router.put("/item", testOrderItem);

// copy of orderController endpoint, but will allow for custom Date input for testing
router.put("/", testPlaceOrder);

module.exports = router;