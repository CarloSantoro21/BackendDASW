const router = require("express").Router()
const users = require('../data/usersdata.json')
const auth = require('../middlewares/auth')
const {nanoid} = require('nanoid')
const fs = require('fs')

// console.log(users);
router.get('/', auth.validateHeader, auth.validateAdmin, (req,res)=>{
    console.log(req.query);
    // console.log(req.get('x-auth'));
    // let token = req.get('x-auth')
    // let admin = false;
    // if(token == '23423')
    //     admin = true;

    
    let filteredUsers = users.slice()
    let {name, email, minId, maxId, pageSize, pageNumber} = req.query;
    console.log(name, email);
    if(name){
        filteredUsers = filteredUsers.filter(u => 
                    u.name.toUpperCase().includes(name.toUpperCase())
                    )
    }

    if(email){
        filteredUsers = filteredUsers.filter(u => 
                    u.email.toUpperCase().includes(email.toUpperCase())
                    )
    }
    if(minId){
        filteredUsers = filteredUsers.filter(u => u.id >= minId)
    }
    if(maxId){
        filteredUsers = filteredUsers.filter(u => u.id <= maxId)
    }


    //Pagination
    //if it's not specified in the req.query
    pageSize = pageSize ?? 3 
    pageNumber = pageNumber ?? 1

    let minIndex = (pageNumber-1)*pageSize

    filteredUsers = filteredUsers.slice(minIndex, minIndex+pageSize)

    // pageSize = pageSize? pageSize: 3

    if(!req.admin){
        //returns just an object with the name
        filteredUsers = filteredUsers.map(u => ({name: u.name}))
    }

    res.send(filteredUsers)
})

router.get('/:uid', (req, res)=>{
    console.log(req.params.id);
    let user = users.find(u=> u.id == req.params.uid )
    if (!user){
        res.status(404).send({error: "User not found"})
        return;
    }
    res.send(user)
})

// this will never be reached
router.get('/:email', (req, res)=>{
    console.log(req.params.email);
    // let user = users.find(u=> u.id == req.params.uid )
    // if (!user){
    //     res.status(404).send({error: "User not found"})
    //     return;
    // }
    res.send({})
})

router.post('/', (req,res)=>{
    console.log(req.body);
    let {name, email } = req.body;
    if( name && name.trim() && email && email.trim() ){
        
        let user = users.find(u => u.email == email)
        if(user){
            res.status(400).send({error: 'User exists'})
            return 
        }

       
        let userObj = {name, email, uid: nanoid(6)  }
        users.push(userObj)
        fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )

        res.status(201).send(userObj)
        return
    }

    let error = ''
    if(name == undefined || !name.trim())
        error += 'name is invalid;'
    if(email == undefined || !email.trim())
        error += 'email is invalid'

    res.status(400).send({error})

})

//updating an existent object
router.put('/:id', (req,res)=>{
    //search for the id
    let user = users.find( u => u.id == req.params.id)

    //if not found 
    if (!user){
        // return 404 not found 
        res.status(404).send({error: 'User not found'})
        return
    }
       
    //if found
        // update data z
    let {name, email} = req.body;

    if(!name || !email) {
        res.status(400).send({error: 'name or email are not valid'})
        return
    }

    user.name = name;
    user.email = email;
    fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )
    res.send(user)

        
})

router.delete('/:id', auth.validateHeader, auth.requiredAdmin, (req, res)=>{
    // search for the id
    let pos= users.findIndex(u => u.id == req.params.id)
    
    // if not found return 404
    if(pos== -1){
        res.status(404).send({error: 'User not found'})
        return
    }

    let deletedUser = users.splice(pos,1)
    fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )
    res.send({deletedUser})
})

module.exports = router;