const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

const routes = require('./server'); 

app.use( express.static( __dirname + '/public' ));
app.use('/assests', express.static(__dirname + '/public/'));
app.use('/node_modules', express.static(__dirname + '/node_modules/'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.set('view engine', 'hbs');

function getProtocol (req) {

    var proto = req.connection.encrypted ? 'https' : 'http';
    proto = req.headers['x-forwarded-proto'] || proto;
    return proto.split(/\s*,\s*/)[0];
  
}

// PUBLIC
app.get('/', function(req, res){

    res.render('home/home',{
        titulo: 'Game',
        urlService: getProtocol(req) + '://' + req.get('host') + '/service/'
    });
    
});

// SERVER ----->
app.use('/service', routes);

app.listen(port, (err) => {

    console.log('Servidor corriendo en el puerto ' + port);

});