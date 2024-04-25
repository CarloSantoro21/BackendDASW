const mongoose = require("mongoose")
const config = require('./config')

console.log(config.getUrl())

mongoose.connect(config.getUrl(), {
    useNewUrlParser: true
})
.then(()=> console.log("connected to db") )
.catch(err => console.log("not connected to db", err))

module.exports = {mongoose}