require('dotenv').config()
const express = require('express');
const userRoutes = require('./routes/userRoutes')
const imageRoutes = require('./routes/imageRoutes')
const authRoutes = require('./routes/authRoute')

const path = require('path')
const app = express();
const port = process.env.PORT || 3001; //a server will give us a port or we will use 3001


function logger(req, res, next){
    console.log("log ",req.url);
    next()
}

console.log(__dirname);

app.use(express.static(path.join(__dirname, 'public')))
// app.use('/users/:id',express.static(path.join(__dirname, 'public/users')))

//we can read the body through req.body
app.use(express.json())

app.get('/', (req,res)=>{
    res.send("hello")
})

app.use('/api/users', logger,  userRoutes )
app.use('/api/images', logger,  imageRoutes )
app.use('/api/login', logger,  authRoutes )

app.listen(port, ()=>console.log("running in port "+port) )