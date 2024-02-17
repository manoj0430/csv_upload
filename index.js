const express = require('express');
require('dotenv').config();
const port=process.env.CSV_PORT;
const app=express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const routes = require('./routes');
const db=require('./config/mongoose');

app.use(express.urlencoded());
app.use(expressLayouts);
app.use('/',routes);
// setting up the view engine as ejs
app.set('view engine','ejs');
// setting up the views folder as ./views
app.set('views',path.join(__dirname,'./views'));
// way to declare upload file path make the upload path  to the browser
app.use('/uploads',express.static(__dirname +'/uploads'));





// setting up the assests path
app.use(express.static('./assets'));

// extract style and scripts from sub pages into the payout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.listen(port,function(err){
    if(err){console.log('error in running the server',err);
    return;}
    
    console.log('Server is running on port :',port);
})