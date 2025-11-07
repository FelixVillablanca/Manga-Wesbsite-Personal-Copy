
const express = require('express');
const router = express.Router();


//Import controllers 
//for users
const { register_user, login} = require('../Controller/userController');

//for manga
const { create_manga, 
    create_chapters, 
    set_chapter_one_idfk, 
    get_mangas, get_manga, 
    update_manga, 
    delete_manga, 
    view_manga, 
    add_new_image, 
    new_added_chapter,
    view_chapter
} = require('../Controller/Manga_Controller')



// ================ Users
//Import Authentication Middleware for authorization of routes
// const verifyToken = require('./Middleware/Authentication');


router.post('/createUser', register_user);
router.post('/login', login)
// router.post('/login', verifyToken, login) //example of the token middleware i created
// then to use, res.json({req.user.username}) //user is decoded in verifyToken function after jwt.verify()

//routers with verifyToken after logging in

// ================ Managing Manga
const upload = require('../Middleware/multer');

router.post('/manage_Manga', create_manga);
router.post('/manage_chapters/:id', upload.array('pre_images'), create_chapters);
router.put('/set_chapter_ONE_idfk/:id', set_chapter_one_idfk) //for updating the chapter_idfk

router.get('/get_Mangas', get_mangas);
router.get('/get_manga/:id', get_manga); //for getting the specific manga in edit Link or <a> - logic
router.put('/update_manga/:id', upload.array('pre_images'), update_manga); //for updating of the changes of the user in edit_manga
router.delete('/delete_manga/:id', delete_manga);

router.get('/view_manga/:id', view_manga)
router.put('/NewAdded_Images/:id', upload.array('New_Added_Images'), add_new_image) // for adding images on the specific chapter

router.post('/Added_newChapter/:id', upload.array('newChapter_images'), new_added_chapter)
router.get('/view_chapter_selected/:manga_id', view_chapter)


module.exports = router;
