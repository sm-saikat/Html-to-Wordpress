const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb)=>{

        if(path.extname(file.originalname).toLowerCase() == ".zip"){
            cb(null, true)
        }else{
            cb(new Error('Upload Only Zip File'))
        }
    }
})

module.exports = upload