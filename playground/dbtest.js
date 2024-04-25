const mongoose = require("mongoose")
const dbUser = "dbUser"
const password = "UserDB"
const dbUrl = `mongodb+srv://${dbUser}:${password}@dasw.5dk6j9h.mongodb.net/?retryWrites=true&w=majority&appName=dasw`

mongoose.connect(dbUrl, {
    useNewUrlParser: true
})
.then(()=> console.log("connected to db") )
.catch(err => console.log("not connected to db", err))