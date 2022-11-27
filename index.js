const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const adminRouter = require('./src/routes/admin');
app.use('/', adminRouter);

app.listen(process.env.PORT, () => {
    console.log(`App Listen on Port ${process.env.PORT}!`);
});