const express = require('express')
const multer = require('multer')
const path = require('path')

const app = express()
const fileStorageEngine = multer.diskStorage({
    
    destination: (req, file, cb) =>{
        cb(null, './images')
    },

    filename: (req, file, cb) =>{
        cb(null, Date.now() + "..." + file.originalname)
    }
})
const upload = multer({storage:fileStorageEngine})

app.post ('/singleupload', upload.single('image'), (req, res) =>{
    console.log(req.file)
    res.status(200).send('Image upload successful')
})

app.post('/multipleupload', upload.array('images', 3), (req,res) => {
    console.log(req.files)
    res.status(200).send('Multiple upload successful')
})

// Video Upload
const videoStorage = multer.diskStorage({
    destination: 'videos', // Destination to store video 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 50000000   // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|MPEG-4)$/)) {     // upload only mp4 and mkv format
            return cb(new Error('Please upload a Video'))
        }
        cb(undefined, true)
    }
})

app.post('/uploadVideo', videoUpload.single('video'), (req, res) => {
    res.send(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.listen(3000, ()=>{console.log('server running on port 3000')})