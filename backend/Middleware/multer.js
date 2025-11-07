const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, path.join(__dirname, '..', 'Manga', 'upload_pre_images_manga'));
        cb(null, path.join(__dirname, '../Manga/upload_chapter_images')); // ✅ must match deletion path
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage });

module.exports = upload;
