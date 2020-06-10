const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('../routes/categoria'));
app.use(require('../routes/producto'));

module.exports = app;