require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.URLDATABASE, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos online');
    }
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000');
})