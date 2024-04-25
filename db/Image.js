const {mongoose} = require("./connectdb")
const {User} = require("./User")

const ImageSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    binary: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: true
    }
})



ImageSchema.statics.saveImage = async (email, imageData)=>{
    imageData.owner = email;
    let newImage = Image(imageData);
    let doc = await newImage.save();

    await User.addImage(email, doc._id)

    return doc;
}

ImageSchema.statics.getImages = async (email)=>{
    let images = await Image.find({owner:email})
                            .select('name url owner')
    return images
}

ImageSchema.statics.findImageByName  = async(name)=>{
    let image = await Image.findOne({name})
    return image;
}

ImageSchema.statics.deleteImage =async(email, name)=>{
    let deletedImage = await Image.findOneAndDelete({owner:email, name})
    // console.log(deletedImage);
    if(!deletedImage)
        return null
    return await User.removeImage(email, deletedImage._id)
}


let Image = mongoose.model("Image", ImageSchema)

module.exports = {Image}