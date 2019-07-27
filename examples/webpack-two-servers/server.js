const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('build'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080, function() {
    console.log('Dev-server runngin on http://localhost:8080');
});