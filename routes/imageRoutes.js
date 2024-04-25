const router = require("express").Router()
const {Image} = require('../db/Image')
const auth = require('../middlewares/auth')


//  /api/images/mine
router.get('/mine', auth.validateToken,  async(req,res)=>{
    console.log("owner", req.email, req._id);
    const images =  await Image.getImages(req.params.email)
    res.send(images)
})

router.get('/:email',  async (req, res)=>{
    const images =  await Image.getImages(req.params.email)
    res.send(images)
})



router.post('/:email', async (req,res)=>{
    //validate body 
    let {name, url, description, binary} = req.body;

    if(!name || !url || !description || !binary){
        res.status(400).send({error: 'missing attributes'})
        return
    }

    let doc = await Image.saveImage(req.params.email, req.body)

    res.status(201).send(doc)


})

router.delete('/:userEmail/:imageName', async(req,res)=>{
    let resp= await Image.deleteImage(req.params.userEmail, req.params.imageName)
    console.log(resp);

    if(!resp){
        res.status(404).send('Image or user not found');
        return
    }

    res.send(resp)
})

module.exports = router;