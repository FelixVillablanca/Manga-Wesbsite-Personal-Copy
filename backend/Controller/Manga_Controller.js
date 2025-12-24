
const asyncHandler = require('express-async-handler');
const { MangaModel } = require('../Models/manga.models.js');
const { ChaptersModel } = require('../Models/chapters.model.js')
const { LatestChapters_Model } = require('../Models/Latest_Chapters.model.js')
const { User_Activities_Model } = require('../Models/user_Activities.model.js')
const { UserModel } = require('../Models/users.model.js')

const fs = require('fs');
const path = require('path');

const create_manga = asyncHandler(async (req, res) => {
    const { title, genres, status, Published_Status, Set_Author } = req.body;
    // const Images = req.files.map(file => `/uploads/${file.filename}`);

    if (!title || !genres) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const manga = await MangaModel.create({
        title,
        Genre: genres, // Assuming 'Genre' in the model stores the JSON string of genres
        // Images: images
        Chapter: 1, // continue, make this an Array []
        Status: status,
        Published : Published_Status,
        Author : Set_Author
    });

    
    if (manga) {
        try {
            res.status(201).json({
                _id: manga._id,
                title: manga.title,
                genres: manga.Genre,
                //images : manga.Images,
                chapters: manga.Chapters,
                status: manga.Status,
                published : manga.Published,
                author : manga.Author
    
            });
            
        } catch (error) {
            console.error('backend creation manga error: ', error)
        }
    } else {
        res.status(400);
        throw new Error('Invalid manga data');
    }
});

const create_chapters = asyncHandler( async (req, res) => {
    const get_id = req.params.id;
    // const { images } = req.body;
    const ArrayImages = req.files.map(file => `/uploads/${file.filename}`);
    // console.log('creating chapter one, checking files: ', ArrayImages)

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
    }

    // console.log('the id: ', get_id)
    // images.forEach(element => {
    //     console.log('from backend, images path: ', element)
    // });

    const chapter = await ChaptersModel.create({
        manga_idfk : get_id,
        images :  ArrayImages
    })

    try {
        if (chapter) {
            res.status(201).json({
                status : true,
                _id : chapter.id,
                imagesOfArray : chapter.images
            })
        }
    } catch (error) {
        console.error(error)
    }
    
})

const  set_chapter_one_idfk = asyncHandler( async (req, res) => {
    
    const findNewlyCreated_manga = await MangaModel.findById(req.params.id);

    const { chapter_id } = req.body;

    if (findNewlyCreated_manga) {
        
        findNewlyCreated_manga.Chapters_idfk.push(chapter_id)

        // const chapter = await ChaptersModel.findById(chapter_id);
        // if (chapter && chapter.images.length > 0) {
        //     findNewlyCreated_manga.Images = [chapter.images[0]];
        // }

        const updatedChapter_idfk = await findNewlyCreated_manga.save();
        res.status(200).json(updatedChapter_idfk)

    } else {
        res.status(404)
    }

})
//==============================================

const get_mangas = asyncHandler(async (req, res) => {
    const mangas = await MangaModel.find({}).populate('Chapters_idfk').sort({ createdAt: -1 });
    res.status(200).json(mangas);
});

const admin_get_manga = asyncHandler(async (req, res) => {
    try {
        const manga = await MangaModel.findById(req.params.id).populate('Chapters_idfk');
        if (manga) {
            res.status(201).json(manga)
        }
    } catch (error) {
        console.error('From backend received an Error: ', error)
    }
})


//for manga edit
const get_manga = asyncHandler(async (req, res) => { //getting the specific item or manga that has been chose to edit of the user
    const {manga_id, user_id, continueAdd} = req.params; //all strings from parameters

    const shouldAdd = continueAdd === "true"; //  convert to boolean

    const manga = await MangaModel.findById(manga_id).populate('Chapters_idfk');
    if (!manga.UserInteracted.includes(user_id)) {

        if (shouldAdd === true) { 
            manga.UserInteracted.push(user_id) // pushing the id of the user to the UserInteracted in manga for number of readers or visitors of that manga
            await manga.save();
        }
        
        const forUserActivity = await User_Activities_Model.findOne({user_idfk: user_id}); 
        if (!forUserActivity.Recent_Viewed.includes(manga_id)) {
            forUserActivity.Recent_Viewed.push(manga_id) //for adding the id of the manga that the user viewed into the User_Activities_Model.Recent_Viewed for tracking reader user-activities
            await forUserActivity.save();
        }
    }
    console.log('backend: ', continueAdd)
    // if (manga) {
    res.status(200).json(manga);
    // } else {
    //     res.status(404);
    //     throw new Error('Manga not found');
    // }
});

const update_manga = asyncHandler(async (req, res) => {
    const { title, genres, status, Published_Status, Set_Author } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const manga = await MangaModel.findById(req.params.id);

    if (manga) {
        manga.title = title || manga.title;
        manga.Genre = genres || manga.Genre;
        manga.Status = status || manga.Status;
        manga.Published = Published_Status || manga.Published;
        manga.Author = Set_Author || manga.Author;
        if (images.length > 0) {
            manga.Images = images;
        }

        const updatedManga = await manga.save();
        res.status(200).json(updatedManga);
    } else {
        res.status(404);
        throw new Error('Manga not found');
    }
});

// const delete_manga = asyncHandler(async (req, res) => {
//     const manga = await MangaModel.findById(req.params.id).populate('Chapters_idfk');

//     if (manga) {
//         // Delete images from the filesystem
//         if (manga.Images || manga.Images.length > 0) {
//             manga.Images.forEach(imagePath => {
//                 // Construct the full path to the image file
//                 const fullPath = path.join(__dirname, '..', 'Manga', 'upload_pre_images_manga', path.basename(imagePath));
//                 fs.unlink(fullPath, (err) => {
//                     if (err) {
//                         // Log the error but don't block the process
//                         // The file might not exist, or there could be a permissions issue
//                         console.error(`Failed to delete image file: ${fullPath}`, err);
//                     }
//                 });
//             });
//         }

//         await manga.deleteOne();
//         res.status(200).json({ message: 'Manga removed' });
//     } else {
//         res.status(404);
//         throw new Error('Manga not found');
//     }
// });

const delete_manga = asyncHandler(async (req, res) => {
    const manga = await MangaModel.findById(req.params.id).populate('Chapters_idfk');

    if (!manga) {
        return res.status(404).json({ message: 'Manga not found' });
    }

  // Delete manga preview images
//   if (manga.Images?.length > 0) {
//     manga.Images.forEach(imagePath => {
//       const fullPath = path.join(__dirname, '..', 'Manga', 'upload_pre_images_manga', path.basename(imagePath));
//       fs.unlink(fullPath, err => {
//         if (err) console.error(`Failed to delete manga image: ${fullPath}`, err);
//       });
//     });
//   }

  // Delete chapter images and documents
    for (const chapter of manga.Chapters_idfk) {
        if (chapter.images?.length > 0) {
            chapter.images.forEach(imagePath => {
                const fullPath = path.join(__dirname, '..', 'Manga', 'upload_chapter_images', path.basename(imagePath));
                fs.unlink(fullPath, err => {
                    if (err) console.error(`Failed to delete chapter image: ${fullPath}`, err);
                });
            });
        await chapter.deleteOne(); // remove chapter document
        }

    }

  // Delete manga document
    await manga.deleteOne();

    await User_Activities_Model.updateMany(
        {}, { // acts as filter means: The empty {} means: "apply this update to all documents in the collection."
            $pull : { // expect a single value not an array
                liked : req.params.id, // will remove that match on the ID
                Recent_Viewed : req.params.id
            }
        }
    )

    await LatestChapters_Model.updateMany({}, // can also be updateOne since it's only have one collection/table
        {
            $pull : { // it's like removing all latestChapters that's on manga.Chapters_idfk
                LatestChapters : { $in : manga.Chapters_idfk} 
            } // For Every document, remove any element in LatestChapters 
            // that matches any of the chapter IDs in manga.Chapters_idfk
        }
    )

  res.status(200).json({ message: 'Manga and related chapters removed' });
});

const view_manga = asyncHandler(async (req, res) => {

    try {
        const View_Manga = await MangaModel.findById(req.params.id).populate('Chapters_idfk')
        res.status(200).json(View_Manga)
        
    } catch (error) {
        res.status(404)
    }


})

const add_new_image = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ArrayImages = req.files.map(file => `/uploads/${file.filename}`);
    // console.log('Check files from backend', ArrayImages)

    if (!ArrayImages) {
        return res.status(404)
    }
    const get_chapter = await ChaptersModel.findById(id);

    if (!get_chapter) {
        return res.status(404);
    }

    get_chapter.images.push(...ArrayImages);

    await get_chapter.save();
    console.log('Updated chapter:', get_chapter);
    res.json(get_chapter)

})

const new_added_chapter = asyncHandler( async (req, res) => {
    const { id } = req.params;
    const ImagesArray = req.files.map(file => `/uploads/${file.filename}`)
    // console.log('images array: ', ImagesArray)

    if (!req.files || req.files?.length === 0 ) return res.status(404).json({message : "Images not found or Empty"})
    
    try {
        const createNewChapter = await ChaptersModel.create({
            manga_idfk : id,
            images : ImagesArray
        })
        if (!createNewChapter) {
            res.status(500).json({message : "Failure on adding new chapter"})
        }

        const manga = await MangaModel.findById(id);
        console.log('manga: ', manga)
        if (manga) {

            if (!manga.Chapters_idfk.includes(createNewChapter._id)) { // if not yet in the Chapter_idfk, it will continue to push the newly created chapter to the Chapters_idfk 
                manga.Chapters_idfk.push(createNewChapter._id)

                await manga.save()
                const findLatestChapter = await LatestChapters_Model.findOne();
                if (!findLatestChapter) { //will create one Latest chapter if no LatestChapter yet
                    findLatestChapter = await LatestChapters_Model.create({
                        LatestChapters : [createNewChapter._id]
                    });
                    
                } else { // else will continue pushing the id of the new chapter to the LatestChapters
                    findLatestChapter.LatestChapters.push(createNewChapter._id)
                    await findLatestChapter.save();
                }

                res.status(200).json({message : "Successfully added new chapter"})
            }
            return res.status(400).json({message : "Chapter id already exist in Chapters_idfk "})
        }
    } catch (error) {
        console.log('Something went wrong..', error)
    }
}) 

const view_chapter = asyncHandler(async (req, res) => {
    const { manga_id } = req.params;

    const get_the_chapter = await MangaModel.findById(manga_id).populate('Chapters_idfk')
    try {
        if (get_the_chapter) {
            res.status(200).json(get_the_chapter)
        }
    } catch (error) {
        console.error('From Backend error: ', error)
    }

}) 

const get_chapter = asyncHandler(async (req, res) => {
    const { chapter_id } = req.params;

    try {
        const getChapter = await ChaptersModel.findById(chapter_id)
        if (!getChapter) return res.status(404).json({message : "chapter not found"})
        
        res.status(201).json(getChapter);

    } catch (error) {
        console.error('From backend received an Error: ', error)
    }
    

})

const Latest_Chapters = asyncHandler(async (req, res) => {
    const findLatest_Chapters = await LatestChapters_Model.findOne().sort({ createAt: -1 })

    if (!findLatest_Chapters) return res.status(404).json({message : "Not Found any Latest Chapters"})
    res.status(201).json(findLatest_Chapters)
})

// const checkedLiked = asyncHandler(async (req, res) => {
    
// })

const set_heart = asyncHandler(async (req, res) => {
    const {user_activity_id, manga_id, user_id} = req.params;
    console.log('manga_id: ', manga_id)
    const User_Activity = await User_Activities_Model.findById(user_activity_id)
    console.log('User_Activity: ', User_Activity)
    if (!User_Activity) {
        const createOne = User_Activities_Model.create({
            user_idfk : user_id,
            liked : manga_id
        })
        await createOne.save();
        res.status(201).json({ message : "user Activity created and Liked has been set"})
    }
    User_Activity.liked.push(manga_id)
    await User_Activity.save();

    const manga = await MangaModel.findById(manga_id);

    manga.UsersLiked.push(user_id)
    await manga.save();

    res.status(201).json({ message: "Liked set" })
})

const unSet_heart = asyncHandler(async (req, res) => {
    const {user_activity_id, manga_id, user_id} = req.params;
    const User_Activity = await User_Activities_Model.findById(user_activity_id);

    if (!User_Activity) return res.status(404).json({ message : 'Not Found'})
    
    // removing the manga_id in Liked of that User Activity without fetching
    await User_Activities_Model.updateOne({ _id : user_activity_id}, { $pull : {liked : manga_id} }) // to unlike

    await MangaModel.updateOne({_id : manga_id}, {
        $pull : {
            UsersLiked : user_id
        },
    }) // to remove the id of the users who liked to that specific manga

    res.status(201).json({ message : 'set to unheart, Successfully'})
})

const CheckLiked = asyncHandler(async(req, res) => {
    
    try {
        const { user_activities_id, manga_id } = req.params;
        const findActivities = await User_Activities_Model.findById(user_activities_id);
        console.log('find: ',findActivities)
        if (!findActivities) return res.status(404).json({ isLiked : false })

            const isLiked = findActivities.liked.some(idfk_of_mangas => idfk_of_mangas.toString() === manga_id); 
            // console.log('isLiked: ', isLiked)
            res.status(200).json({ isLiked })
        
    } catch (error) {
        console.error('From backend error: ', error)
    }
})

const get_latest_chapters = asyncHandler(async (req, res) => {
    const getLatest_chapters = await LatestChapters_Model.findOne({});
    
    // console.log('latest Chapters: ', getLatest_chapters)
    if (!getLatest_chapters) {
        return res.status(404).json({ message : 'From backend, No Latest Chapters'})
    }
    
    // Find all manga where at least one chapter in Chapters_idfk is in the list of LatestChapters
    const Latest_manga = await MangaModel.find({Chapters_idfk : { $in : getLatest_chapters.LatestChapters}}).populate('Chapters_idfk') 
    // console.log('latest Manga: ', Latest_manga)
    res.status(200).json(Latest_manga)

})

const get_TopTen_MostView_Manga = asyncHandler(async (req, res) => {
    try {
        
        const topViewedManga = await MangaModel.aggregate([
            {
                $addFields : {
                    interactionCount : { $size : "$UserInteracted" }
                }
            },
            {
                $sort : { interactionCount : -1 }
            },
            {
                $limit : 5
            },
            {
                $lookup : { 
                    // since .populate does not support on aggregation pipeline because .aggregate returns a raw MongoDB cursor
                    from : "chapters",
                    localField : "Chapters_idfk",
                    foreignField : "_id",
                    as : "Chapters" //new field containing the population of the Chapters_idfk just like .populate("Chapters_idfk") but since .populate doesn't work on the aggregation or aggregate pipeline, will added $ lookup for creating a new field and assigning the population of the Chapters_idfk
                    // the population of the Chapters_idfk will go to this -> as : "Chapters", this is an alias or new field only on the topViewedManga 

                }
            }
        ])
        if (!topViewedManga) return res.status(500).json({ StatusOk : false })

        // console.log(topViewedManga)
        res.status(201).json({ StatusOk : true, TopViewedManga : topViewedManga})
    } catch (error) {
        console.error("Error fetching top view manga", error)
    }

})

const get_TopTen_MostLikes_Manga = asyncHandler(async (req, res) => {

    const TopTen_MangaLikes = await MangaModel.aggregate([
        {
            $addFields : {
                interactionCount : { $size : "$UserInteracted"},
                NumberReaderLiked : { $size : "$UsersLiked"}
            }
        },
        {
            $sort : { 
                interactionCount : -1,
                NumberReaderLiked : -1,
            }
        },
        {
            $limit : 10
        }
        ,
        {
            $lookup : {
                from : "chapters",
                localField : "Chapters_idfk",
                foreignField : "_id",
                as : "Chapters" 
            }
        }
    ])
    console.log('Top Ten Manga Likes: ', TopTen_MangaLikes)
    if (TopTen_MangaLikes) {
        res.status(200).json(TopTen_MangaLikes)
    }
})

// db.mangas.find({ UsersLiked: { $exists: true, $not: { $size: 0 } } })

const getUser_Liked_Mangas_chapter_id = asyncHandler(async (req, res) => { 
    const { manga_chapter_id } = req.params; 

    const manga_chapter = await ChaptersModel.findById(manga_chapter_id)
    if (!manga_chapter) {
        res.status(404).json({message : 'chapter not found'})
    }

    res.status(201).json(manga_chapter)
}) 

const get_Recent_Manga_chapter_First_image = asyncHandler(async(req, res) => {
    const { manga_chapter_id } = req.params;

    const manga_chapter = await ChaptersModel.findById(manga_chapter_id);

    if (!manga_chapter) return res.status(404).json({ message : "chapter not found"})

    res.status(201).json(manga_chapter)
})

// Dashboard Statistics
const get_Dashboard_Statistics = asyncHandler(async (req, res) => {
    try {
        // Total counts
        const totalMangas = await MangaModel.countDocuments();
        const totalUsers = await UserModel.countDocuments({ role: 2 }); // Only readers (role 2)
        const totalChapters = await ChaptersModel.countDocuments();
        
        // Published vs Unpublished
        const publishedMangas = await MangaModel.countDocuments({ Published: 'Published' });
        const unpublishedMangas = await MangaModel.countDocuments({ Published: 'Unpublished' });
        
        // Total views (sum of all UserInteracted arrays)
        const allMangas = await MangaModel.find({});
        const totalViews = allMangas.reduce((sum, manga) => sum + (manga.UserInteracted?.length || 0), 0);
        
        // Total likes (sum of all UsersLiked arrays)
        const totalLikes = allMangas.reduce((sum, manga) => sum + (manga.UsersLiked?.length || 0), 0);
        
        // Top 5 Most Viewed Mangas
        const topViewedManga = await MangaModel.aggregate([
            {
                $addFields: {
                    interactionCount: { $size: "$UserInteracted" }
                }
            },
            {
                $sort: { interactionCount: -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    title: 1,
                    interactionCount: 1,
                    Published: 1,
                    Status: 1,
                    createdAt: 1
                }
            }
        ]);
        
        // Top 5 Most Liked Mangas
        const topLikedManga = await MangaModel.aggregate([
            {
                $addFields: {
                    likesCount: { $size: "$UsersLiked" }
                }
            },
            {
                $sort: { likesCount: -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    title: 1,
                    likesCount: 1,
                    Published: 1,
                    Status: 1,
                    createdAt: 1
                }
            }
        ]);
        
        // Recent Mangas (last 5 created)
        const recentMangas = await MangaModel.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title Published Status createdAt');
        
        res.status(200).json({
            success: true,
            statistics: {
                totalMangas,
                totalUsers,
                totalChapters,
                publishedMangas,
                unpublishedMangas,
                totalViews,
                totalLikes
            },
            topViewedManga,
            topLikedManga,
            recentMangas
        });
    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching dashboard statistics',
            error: error.message 
        });
    }
});



module.exports = {
    create_manga,
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
    // checkedLiked,
    set_heart,
    unSet_heart,
    CheckLiked,
    get_latest_chapters,
    get_TopTen_MostView_Manga,
    get_TopTen_MostLikes_Manga,
    getUser_Liked_Mangas_chapter_id,
    get_Recent_Manga_chapter_First_image,
    get_Dashboard_Statistics
};
