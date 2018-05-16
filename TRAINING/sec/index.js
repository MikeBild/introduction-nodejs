const express = require("express");
const app = express();
const samples = require("./routes/samples");
const orders = require("./routes/orders");

app.use("/samples", samples);
app.use("/orders", orders);

app.listen(8080, () => console.log(`Listen on 8080`));
