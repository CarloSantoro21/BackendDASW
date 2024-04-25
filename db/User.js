const { use } = require("../routes/userRoutes");
const {mongoose} = require("./connectdb")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Image',
        default:[]
    }]
})


userSchema.statics.getImages = async(email) => {
    let images = await User.findOne({email})
                           .populate('images', 'name, url');
    console.log(images.images);
    return images.images;
}


userSchema.statics.addImage = async (email, imageId)=>{
    const user = await User.findOne({email})
    if(user){
        user.images.push(imageId)
        return await user.save()
    }
    return {error: "user not found"}
}

userSchema.statics.removeImage = async(email,imageId)=>{
    const user = await User.findOneAndUpdate({email},{$pull:{images: imageId}}, {new:true}) 
    return user;
}

userSchema.statics.addImageV2 = async (email, imageId)=>{
    const user = await User.findOneAndUpdate({email},{$push:{images: imageId}}, {new:true}) 
    return user;
}

userSchema.statics.findUsers = async (filter={}, 
     isAdmin = false,
     pageSize=4,
     pageNumber=1)=>{
    let proj = isAdmin? {}: {name:1, email:1, _id:0} ;

    //we removed the await to get only the Promise
    let docs =  User.find(filter,proj)
                    .sort({name:1})
                    .skip((pageNumber-1)*pageSize)
                    .limit(pageSize)
                    .populate('images', 'name url -_id')

    //we removed the await to get only the Promise
    let count = User.find(filter).count()

    // we removed the await in previous lines to execute both queries and wait for both 
    // it is not the same than wait the first to finish to execute the second. 
    let resp = await Promise.all([docs, count])
    let users = resp[0];
    let total =  resp[1];    
    console.log(resp[0], resp[1]);
    return {users, total, page: pageNumber, pageSize}
}

userSchema.statics.saveUser = async (userData)=>{
    let hash = bcrypt.hashSync(userData.password, 10)
    userData.password = hash; 
    let newUser = User(userData);
    return await newUser.save()
}

userSchema.statics.findUser  = async(email)=>{
    let user = await User.findOne({email})
                         .populate('images', 'name url description -_id')
    return user;
}

userSchema.statics.updateUser = async (email, userData)=>{
    // delete userData.email
    if (userData.password){
        let hash = bcrypt.hashSync(userData.password, 10)
        userData.password = hash; 
    }

    let updatedUser = await User.findOneAndUpdate({email},
                                {$set: userData},
                                {new:true}
                            )
    return updatedUser;
}

userSchema.statics.deleteUser = async(email)=>{
    let deleted = await User.findOneAndDelete({email})
    // console.log(deleted);
    return deleted;
}

userSchema.statics.authUser = async(email, password)=>{
    let user = await User.findOne({email})

    if(!user)
        return null

    if (bcrypt.compareSync(password, user.password)){
        return user
    }

    return null
}

let User = mongoose.model('User', userSchema)
// async function findUsers(){
//     let docs = await User.find({})
//     console.log(docs);
// }
// findUsers()

async function  createAndShow(){
    let doc = await User.saveUser({
        "name": "Gemini",
        "email": "Gemini@google.com",
        "password": "Gemini"
    });
    User.findUsers();
}



// User.findUsers({email: /a/i},true);
// User.findUsers({},true);
User.findUsers({},false);        
// createAndShow()


module.exports = {User}

