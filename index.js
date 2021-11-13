'use strict';

const express = require('express')

const app = express()
require('./routes')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is running at port ${port}`);
});
