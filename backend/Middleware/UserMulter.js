const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, '../User/ProfileUploads'));
    },
    filename : (req, file, cb) => {
        const unique_filename = `${Date.now()}-${file.originalname}`
        cb(null, unique_filename)
    }
    
})

const upload_Image = multer({ storage });
module.exports = upload_Image;