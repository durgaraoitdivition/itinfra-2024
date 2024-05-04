require("dotenv").config();
// require('dotenv').config({ path: '/home/devteam/apis/itinfra2024/.env' });
const baseurl = "/";
const express = require('express');
const port = 6600;
const app =express();
const cors=require("cors");
app.use(cors({
  "origin":"*",
  "credentials":true,
  "optionSucessstatus":200
}));
const orderrtr = require("./router/orders.router")

app.use(express.json({limit: '50mb'}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})



app.use(baseurl+"order", orderrtr)


app.get("/", (req, res)=>{
    res.json({
        success:1,
        message :"this is rest apis working"
    })
})

app.listen(port, ()=>{
    console.log(`Server up and running on port : http://localhost:${port}`)
})