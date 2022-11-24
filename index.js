const express = require('express');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const errorHandler = require('./src/interfaces/http/middlewares/errorHandler');

const routes = require('./src/interfaces/http/routes/index');
app.use(process.env.BASE_PATH || '/', routes);

app.use(errorHandler);

//set public for VPS
const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(port, () => {
    console.log(`App Listen on Port ${port}!`)
})