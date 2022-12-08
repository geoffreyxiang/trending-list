const express = require("express");
const router = express.Router();

const { orderItem, placeOrder } = require("../controllers/orderController");

// equivalent to placing an order on a single item
// body: name, restaurant_name, price, quantity
router.put("/item", orderItem);

// equivalent to placing a full order with potentially many items
// body: order -> [{name, price, quantity}], restaurant_name
router.put("/", placeOrder);

module.exports = router;