// db name = trending

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const InitiateMongoServer = require("./config/db");
const itemRoute = require("./routes/itemRoute");
const orderRoute = require("./routes/orderRoute");
const testingRoute = require("./routes/testingRoute");

InitiateMongoServer();

const app = express();

app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 3030;


app.get('/', function (req, res, next) {
  res.json({msg: 'API working with CORS-enabled!'})
})

app.use('/items', itemRoute);
app.use('/orders', orderRoute);
app.use('/testing', testingRoute);

app.listen(port, function () {
    console.log(`CORS-enabled web server listening on port ${port}`);
})