
const express = require('express');
const router = express.Router();


//Import controllers 
//for users
const { 
    register_user, 
    login, 
    upload_user_profile_changes_without_File, 
    upload_user_profile_changes_with_File,
    get_User_Updated_Session,
    get_Updated_User
} = require('../Controller/userController');

//for manga
const { create_manga, 
    create_chapters, 
    set_chapter_one_idfk, 
    get_mangas, 
    admin_get_manga,
    get_manga, 
    update_manga, 
    delete_manga, 
    view_manga, 
    add_new_image, 
    new_added_chapter,
    view_chapter,
    get_chapter,
    Latest_Chapters,
    set_heart,
    unSet_heart,
    CheckLiked,
    get_latest_chapters,
    get_TopTen_MostView_Manga,
    get_TopTen_MostLikes_Manga,
    getUser_Liked_Mangas_chapter_id,
    get_Recent_Manga_chapter_First_image,
    get_Dashboard_Statistics
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
router.get('/admin_getManga/:id', admin_get_manga)
router.get('/get_manga/:manga_id/:user_id/:continueAdd', get_manga); //for getting the specific manga in edit Link or <a> - logic
router.put('/update_manga/:id', upload.array('pre_images'), update_manga); //for updating of the changes of the user in edit_manga
router.delete('/delete_manga/:id', delete_manga);

router.get('/view_manga/:id', view_manga)
router.put('/NewAdded_Images/:id', upload.array('New_Added_Images'), add_new_image) // for adding images on the specific chapter

router.post('/Added_newChapter/:id', upload.array('newChapter_images'), new_added_chapter)
router.get('/view_chapter_selected/:manga_id', view_chapter);

router.get('/reader_GetChapter/:chapter_id', get_chapter)
router.get('/Latest_Chapters', Latest_Chapters)
router.get('/set_Liked/:user_activity_id/:manga_id/:user_id', set_heart)
router.get('/set_UnLike/:user_activity_id/:manga_id/:user_id', unSet_heart)
router.get('/CheckLiked/:user_activities_id/:manga_id', CheckLiked)
// router.get('/checkLiked/:reader_activity_id/:manga_id', checkedLiked)

router.get('/get_latest_chapters', get_latest_chapters)
router.get('/TopTen_MostView', get_TopTen_MostView_Manga)
router.get('/TopTEN_MostLikes_Manga', get_TopTen_MostLikes_Manga)
router.get('/dashboard/statistics', get_Dashboard_Statistics)

//===================================== USER

const upload_Image = require('../Middleware/UserMulter')
// router.get('/UserUpdated_Credentials/:user_id', get_Updated_User)

// const conditionUpload_Image = (req, res, next) => {
//     if (req.body.isInclude_file == 'true') {
//         upload_Image.single('User_image')(req, res, next);
//     } else {
//         next()
//     }
// }
router.put('/UserProfileUpdate_without_file/:user_id', upload_user_profile_changes_without_File)
router.put('/UserProfileUpdate_with_file_Uploaded/:user_id', upload_Image.single('User_image'), upload_user_profile_changes_with_File);
router.get('/getUpdated_Session/:user_id', get_User_Updated_Session)
router.get('/UserGetLikedManga/:manga_chapter_id', getUser_Liked_Mangas_chapter_id)
router.get('/get_User_Recent_Viewed_Manga_and_get_Chapter_first_image/:manga_chapter_id', get_Recent_Manga_chapter_First_image)

module.exports = router;
