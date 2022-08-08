//database required
require('./models/db');
const express = require('express');
const dotenv = require('dotenv');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const bodyparser = require('body-parser');
const path = require('path');

const app = express();

const userControl = require('./controllers/user-controllers.js');

dotenv.config({ path: 'config.env' });
var PORT = process.env.PORT || 8080;

app.use(bodyparser.urlencoded({ extended: true }));

app.use('/', userControl)

app.set('views', path.join(__dirname, '/views'));
app.engine('hbs', exphbs.engine({ extname: 'hbs', defaultLayout: 'mainFile', handlebars: allowInsecurePrototypeAccess(Handlebars), layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'hbs');


app.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Start => http://localhost:${PORT}/register`);
});

