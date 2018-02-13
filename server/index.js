const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const session = require('express-session');
require('dotenv').config();
const { createInitialSession } = require('./middlewares/sessions')
const filter = require('./middlewares/filter');

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );


// console.log(process.env.SESSION_SECRET);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10000
    }

}))

app.use(createInitialSession);

app.use(createInitialSession);
app.use((req, res, next) => {
    if(req.method === 'POST' || req.method === 'PUT'){
        filter(req, res, next)
    }
    next();
})

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );
app.get(`${messagesBaseUrl}/history`, mc.history);

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );