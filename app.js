require("dotenv").config();
const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(require('./routes/api.routes'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on  port ${PORT}.`);
})