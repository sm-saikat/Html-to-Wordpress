const router = require('express').Router()
const{
    uploadGetController,
    uploadPostController,
    convertController
} = require('../controllers/uploadControllers')
const {check} = require('express-validator')
const upload = require('../middlewares/uploadMiddileware')
const unzip = require('../utils/unzip')


router.get('/upload', uploadGetController)

router.post('/upload',
upload.single('theme'),
[
    check('theme')
    .custom((value, {req})=>{
        if(!req.file){
            return false
        }else{
            return true
        }
    }).withMessage('Upload A Zip File')
],
unzip,
uploadPostController)


router.get('/convert-wp/:folderName', convertController)

module.exports = router