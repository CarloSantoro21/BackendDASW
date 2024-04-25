const router = require("express").Router()
const users = require('../data/usersdata.json')
const {User} = require('../db/User')
const auth = require('../middlewares/auth')
const {nanoid} = require('nanoid')
const fs = require('fs')
const { password } = require("../db/config")

// console.log(users);
router.get('/', auth.validateHeader, auth.validateAdmin, async (req,res)=>{
    console.log(req.query);
   
    let filters = {}
   
    // console.log(filteredUsers);
    let {name, email, minId, maxId, pageSize, pageNumber} = req.query;
    console.log(name, email);
    
    pageSize = pageSize ?? 3
    pageNumber = pageNumber ?? 1

    if(name){
        filters.name = new RegExp(name,'i') //  /name/i 
    }
    

    let filteredUsers = await User.findUsers(filters,req.admin, pageSize, pageNumber )
    res.send(filteredUsers)

    // if(name){
    //     filteredUsers = filteredUsers.filter(u => 
    //                 u.name.toUpperCase().includes(name.toUpperCase())
    //                 )
    // }

    // if(email){
    //     filteredUsers = filteredUsers.filter(u => 
    //                 u.email.toUpperCase().includes(email.toUpperCase())
    //                 )
    // }
    // if(minId){
    //     filteredUsers = filteredUsers.filter(u => u.id >= minId)
    // }
    // if(maxId){
    //     filteredUsers = filteredUsers.filter(u => u.id <= maxId)
    // }


    // filteredUsers = filteredUsers.slice(minIndex, minIndex+pageSize)

    // pageSize = pageSize? pageSize: 3

    // if(!req.admin){
    //     filteredUsers = filteredUsers.map(u => ({name: u.name}))
    // }

    
})



router.get('/:uid', auth.validateToken,  (req, res)=>{
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


router.post('/', async (req,res)=>{
    console.log(req.body);
    let {name, email, password } = req.body;
    if( name && name.trim() && email && email.trim() ){
        
        // let user = users.find(u => u.email == email)
        let user = await User.findUser(email)
        if(user){
            res.status(400).send({error: 'User exists'})
            return 
        }

       
        let userObj = {name, email, uid: nanoid(6), password  }
         let newUser = await User.saveUser(userObj)
        //users.push(userObj)
        //fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )

        res.status(201).send(newUser)
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
router.put('/:email', async (req,res)=>{
    //search for the id
    // let user = users.find( u => u.id == req.params.id)
    let user  = await User.findUser(req.params.email)

    //if not found 
    if (!user){
        // return 404 not found 
        res.status(404).send({error: 'User not found'})
        return
    }
       
    //if found
        // update data z
    let {name, password} = req.body;

    if(!name ) {
        res.status(400).send({error: 'name or email are not valid'})
        return
    }

    user.name = name;
    //user.email = req.params.email;
    if(!user.password){
        delete user.password;
    }
            
    let updatedUser = await User.updateUser(user.email, user);
    //fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )
    res.send(updatedUser)

        
})

router.delete('/:email', auth.validateHeader, auth.requiredAdmin, async (req, res)=>{
    // search for the id
    // let pos= users.findIndex(u => u.id == req.params.id)
    
    let user = await User.findUser(req.params.email)

    // if not found return 404
    if(!user){
        res.status(404).send({error: 'User not found'})
        return
    }

    let deletedUser = await User.deleteUser(req.params.email)
    //let deletedUser = users.splice(pos,1)
    //fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )
    res.send({deletedUser})
})

module.exports = router;