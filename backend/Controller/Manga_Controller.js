
const asyncHandler = require('express-async-handler');
const { MangaModel } = require('../Models/manga.models.js');
const { ChaptersModel } = require('../Models/chapters.model.js')
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
    console.log('creating chapter one, checking files: ', ArrayImages)

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
    const mangas = await MangaModel.find({}).sort({ createdAt: -1 }).populate('Chapters_idfk');
    res.status(200).json(mangas);
});


//for manga edit
const get_manga = asyncHandler(async (req, res) => { //getting the specific item or manga that has been chose to edit of the user
    const manga = await MangaModel.findById(req.params.id).populate('Chapters_idfk');
    if (manga) {
        res.status(200).json(manga);
    } else {
        res.status(404);
        throw new Error('Manga not found');
    }
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

  // ✅ Delete manga document
  await manga.deleteOne();

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
    console.log('Check files from backend', ArrayImages)

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

            if (!manga.Chapters_idfk.includes(createNewChapter.id)) {
                manga.Chapters_idfk.push(createNewChapter.id)
                console.log('new manga', manga)
                await manga.save()
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

module.exports = {
    create_manga,
    create_chapters,
    set_chapter_one_idfk,

    get_mangas,
    get_manga,
    update_manga,
    delete_manga,

    view_manga,
    add_new_image,

    new_added_chapter,
    view_chapter
};
