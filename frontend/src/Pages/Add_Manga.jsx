import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { BeatLoader } from 'react-spinners';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../Components/Sidebar";
import Contents from '../Components/Contents';
import '../Styles/style.css';

import { jwtDecode } from 'jwt-decode';

// import { Spinner } from "@/components/ui/spinner"




export default function Add_Manga() {
    const [files, setFiles] = useState([]);
    const [zoomLevels, setZoomLevels] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigateTo = useNavigate();
    
    //FOR ADMIN CREDENTIALS SESSION
    const [Admin, setAdminCredentials] = useState([]);
    useEffect(() => {
        const Admin_Token = localStorage.getItem('AdminCredentials')
        if (Admin_Token) {
            const Admin_Credentials = jwtDecode(Admin_Token);
            setAdminCredentials(Admin_Credentials)
            console.log(Admin)
        } else {
            navigateTo('/')
        }
    },[])
    //=================================================================
    
    
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            files.forEach(file => URL.revokeObjectURL(file.preview));
            setFiles(acceptedFiles.map(file => 
                Object.assign(file, { preview: URL.createObjectURL(file) }) 
                // while URL.createObjectURL(file) there's blob word will be added inline with the URL of the file like : blob:http://localhost:3000/789f20c2-2af2-43ca-8033-b0dda623d47c
                //so if i access that specific file and say files.preview, it will be : "blob:http://localhost:3000/789f20c2-2af2-43ca-8033-b0dda623d47c"
            ));
            setZoomLevels({});
        }
    }, [files]);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    
    // files.forEach(element => { // for checking or testing purposes
    //     console.log('files check prev: ', element.preview)
    // });

    //=======================================================================
    
    const [selectedGenres, setSelectedGenres] = useState([]);
    const handleCheckbox_genre = (event) => {
        const { value, checked } = event.target;
        setSelectedGenres(prev => checked ? [...prev, value] : prev.filter(g => g !== value));
    };

    //Status Published/Unpublished
    const [Published, setPublished] = useState('Unpublished')
    const handlePublished_Status = (event) => setPublished((event.target.checked ? "Published" : "Unpublished"));
    // console.log('Publication useState: ', Published)

    
    //Status radio
    const [statusCheckbox, setStatusCheckbox] = useState("Ongoing");
    const handleCheckbox_status = (event) => setStatusCheckbox((event.target.checked && "Ongoing"));
    // console.log('status: ', statusCheckbox)

    //set Author
    const [Author, setAuthor] = useState('Anonymous');
    const handleAuthor_checkbox = (event) => event.target.checked ? setAuthor(event.target.value) : setAuthor("Anonymous")

    // console.log('Author: ', Author)

    
    //removing file x button
    const sliderRef = useRef(null);
    const handleRemove = (nameToRemove) => {
        const newFiles = files.filter(file => file.name !== nameToRemove);
        setFiles(newFiles);
    };
    
    const handleZoomIn = () => {
        if (files.length === 0) return;
        const currentFile = files[currentSlide];
        setZoomLevels(prev => ({
            ...prev,
            [currentFile.name]: (prev[currentFile.name] || 1) + 0.1
        }));
    };
    
    const handleZoomOut = () => {
        if (files.length === 0) return;
        const currentFile = files[currentSlide];
        setZoomLevels(prev => ({
            ...prev,
            [currentFile.name]: Math.max(0.1, (prev[currentFile.name] || 1) - 0.1)
        }));
    };
    
    
    
    const [loader, setLoader] = useState(false);
    // const [chapters, setChapters] = useState([])
    const handleSubmit = async (event) => {
        event.preventDefault();
        // const formdata = new FormData();
        // formdata.append('title', event.target.Title.value);
        // formdata.append('genres', JSON.stringify(selectedGenres));
        // formdata.append('status', statusCheckbox);
        // formdata.append('Published_Status', Published);
        // formdata.append('Set_Author', Author)

        // files.forEach(file => formdata.append('pre_images', file));

        const load_data = {
            title : event.target.Title.value,
            genres : JSON.stringify(selectedGenres),
            status : statusCheckbox,
            Published_Status : Published,
            Set_Author : Author
        }

        
        try {
            setLoader(true);
            
            const response = await fetch('/api/manage_Manga', {
                method: 'POST',
                // body: formdata
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(load_data),
            });
            const res = await response.json();
            console.log('res:',res)
            if (res) {
                // alert('working here')
                console.log('id from manga created: ',res._id)
                try {
                    // const formdataSecond = new FormData();

                    // res.images.forEach(fileChecker => { // for checking the images customize name
                    //     console.log('Checking res files: ', fileChecker)
                    // })

                    // res.images.forEach(file => formdataSecond.append('chapterOne', file))

                    // formdataSecond.forEach(images => { //for checking the images
                    //     console.log('checking formdataSecond: ', images)
                    // })
                    const formdataTwo = new FormData()
                    files.forEach(file => formdataTwo.append('pre_images', file))
                    console.log('creating chapters, checking files... : ', files)
                    const integrateToChapters = await fetch(`/api/manage_chapters/${res._id}`, { // for creating chapter inline of this Manga, or after creating the manga
                        method : 'POST',
                        // headers : {
                        //     'Content-Type' : 'application/json'
                        // },
                        // body : JSON.stringify({ images : res.images })
                        body : formdataTwo
                    })

                    const response = await integrateToChapters.json();
                    console.log('Message: ',response.message)

                    if (response) {
                        //for setting the chapter 1
                        console.log('id_fk: ', response._id)
                        response.imagesOfArray.forEach(file => {
                            console.log('from the response of creating the chapter: ', file)
                        })
                        console.log('images array: ',response.imagesOfArray)
                        console.log('successfully created chapter')

                        try {
                            //for searching the newly created chapter  
                            const get_the_manga = await fetch(`/api/set_chapter_ONE_idfk/${res._id}`, {
                                method : 'PUT',
                                headers : {
                                    'Content-Type' : 'application/json'
                                },
                                body : JSON.stringify({ chapter_id : response._id })
                            });
                            
                            const result = await get_the_manga.json();
                            if (result) {
                                //for setting the id of the chapter to chapters_idfk in MangaModel
                                //for setting the chapter_idfk in the Manga that is newly created
                                console.log(result)
                                console.log('successfully integrated the id of the chapter to the chapter_idfk in the specific manga')
                                
                                setTimeout(() => {
                                    setLoader(false)
                                    setFiles([]);
                                    setSelectedGenres([]);
                                    setStatusCheckbox("");
                                    event.target.Title.value = "";
                                    window.location.reload();
                                }, 3000)
                            }
                            

                        } catch (error) {
                            console.error(error)
                        }

                    }
                } catch (error) {
                    console.error(error)
                }
            }
            
        } catch (error) {
            console.error(error);
        }
    };
    
    
    
    //Manga
    const [mangas, setMangas] = useState([])
    const [filteredMangas, setFilteredMangas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    useEffect(() => {
        const getMangas = async () => {
            try {
                const result = await fetch('/api/get_Mangas');
                const response = await result.json();
                setMangas(response);
                setFilteredMangas(response);
                
            } catch (error) {
                console.error(error)
            }
        }
        getMangas()
    }, [])
    console.log('mangas: ',filteredMangas)
    
    //for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMangas = filteredMangas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMangas.length / itemsPerPage);
    
    
    //for carousel
    const settings = {
        customPaging: i => (
            <a><img src={files[i]?.preview} alt={`thumbnail-${i}`} className="w-full h-full object-cover" /></a>
        ),
        dots: true,
        dotsClass: "slick-dots slick-thumb",
        infinite: files.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: index => setCurrentSlide(index)
    };

    
    //for delete button
    const [specificMangaToDelete, setSpecificMangaToDelete] = useState('')
    const [deletePrompt, setDeletePrompt] = useState(false)
    const [continueDeleting, setContinueDeleting] = useState(null)
    const [mangaToTitleToDelete, setMangaTitleToDelete] = useState('')
    // const deleteSync = async (id) => {
    //     // setDeletePrompt(true)
    //     console.log('continue delete: ', continueDeleting)
    // }
    
    useEffect(() => {

        if (deletePrompt && continueDeleting) {
            try {   
                async function deleteManga() {

                    const response = await fetch(`/api/delete_manga/${specificMangaToDelete}`, {
                                method: 'DELETE',
                    });

                    if (response.ok) {
                            setMangas(mangas.filter(manga => manga._id !== specificMangaToDelete));
                    } else {
                        const res = await response.json();
                        if (res) {
                                setDeletePrompt(false)
                                window.location.reload();
                            }
                            console.error(res.message);
                    }
                }
                deleteManga()
            } catch (error) {
                    console.error('Error deleting manga:', error);
            }
        }
            // console.log(' delete button: ', deletePrompt)
            console.log('manga to delete id: ', specificMangaToDelete)
            // console.log('continue for deleting: ', continueDeleting)

    },[deletePrompt, continueDeleting])


    //for search
    const search = (event) => {
        const typed = event.target.value;
        if (typed === '') {
            setFilteredMangas(mangas);
        } else {
            const filtered = mangas.filter(manga =>
                manga.title.toLowerCase().includes(typed.toLowerCase())
            );
            setFilteredMangas(filtered);
        }
        setCurrentPage(1);
    }

    return (
        <div className='w-auto h-screen relative flex bg-[#1a1a1a]'>
            <Sidebar Admin={Admin} adminSet={setAdminCredentials}/>
            <main className='w-full h-full p-6 text-white relative overflow-y-auto'>
                <div className="bg-[#2a2a2a] relative w-auto h-full overflow-auto rounded-lg shadow-lg" id='container_addmanga'>
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-t-lg">
                        <header className='p-4 text-black font-bold text-xl flex items-center gap-2'>
                            <span className="material-symbols-outlined">add_circle</span>
                            Add Manga
                        </header>
                    </div>
                    
                    {/* Form Section */}
                    <section className="flex flex-wrap relative w-full p-6">
                        <form className="p-5 flex flex-wrap gap-6 relative w-full justify-center" onSubmit={handleSubmit}>
                            {/* Title Input with Submit Button */}
                            <div className="flex gap-4 items-center relative w-full">
                                <label className="text-gray-300 font-medium text-lg min-w-[80px]">Title:</label>
                                <input 
                                    type="text" 
                                    name="Title" 
                                    className="flex-1 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white rounded-lg text-black p-3 transition-all duration-200" 
                                    placeholder="Enter manga title..."
                                    required
                                />
                                <input 
                                    type="submit" 
                                    value="+" 
                                    className='flex items-center justify-center text-center w-12 h-12 rounded-lg cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl font-bold text-xl' 
                                />
                            </div>
                            
                            {/* Left Column - Genres and Settings */}
                            <div className="relative w-full lg:w-[48%] gap-4 flex flex-col">
                                {/* Genres Section */}
                                <div className="relative gap-3.5 w-full p-6 bg-[#1a1a1a] rounded-lg border border-gray-700 shadow-md">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="material-symbols-outlined text-amber-400">category</span>
                                        <span className='text-amber-400 font-semibold text-lg'>Set Genres</span>
                                    </div>
                                    <div className="w-full flex flex-wrap p-2 gap-2">
                                        {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-fi', 'Thriller'].map(genre => (
                                            <label key={genre} className="flex items-center gap-2 h-auto rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 cursor-pointer transition-all duration-200 border border-gray-600 hover:border-amber-400">
                                                <input 
                                                    type="checkbox" 
                                                    className="checkbox bg-amber-50 w-4 h-4 rounded cursor-pointer" 
                                                    value={genre} 
                                                    checked={selectedGenres.includes(genre)} 
                                                    onChange={handleCheckbox_genre}
                                                />
                                                <span className="text-sm font-medium">{genre}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Story Settings Section */}
                                <div className="relative flex flex-col gap-4 w-full p-6 bg-[#1a1a1a] rounded-lg border border-gray-700 shadow-md">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-amber-400">settings</span>
                                        <span className='text-amber-400 font-semibold text-lg'>Story Settings</span>
                                    </div>
                                    
                                    <div className="relative h-6 flex gap-3 items-center" >
                                        <input 
                                            type="checkbox" 
                                            className="peer h-6 w-10 cursor-pointer appearance-none rounded-full border-2 border-gray-500 peer-checked:bg-amber-400 checked:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 checked:focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none transition-all duration-200"
                                            value="Published" 
                                            onChange={handlePublished_Status} 
                                            checked={Published.includes("Published")}
                                        />
                                        <span className="pointer-events-none absolute start-1 top-1 block size-4 rounded-full bg-gray-400 transition-all duration-200 peer-checked:start-[1.375rem] peer-checked:bg-white"></span>
                                        <span className="text-gray-300 font-medium">Published</span>
                                    </div>
                                    
                                    <div className="relative h-6 flex gap-3 items-center" >
                                        <input 
                                            type="checkbox" 
                                            className="peer h-6 w-10 cursor-pointer appearance-none rounded-full border-2 border-gray-500 peer-checked:bg-amber-400 checked:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 checked:focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none transition-all duration-200"
                                            value={Admin.username}
                                            onChange={handleAuthor_checkbox}
                                        />
                                        <span className="pointer-events-none absolute start-1 top-1 block size-4 rounded-full bg-gray-400 transition-all duration-200 peer-checked:start-[1.375rem] peer-checked:bg-white"></span>
                                        <span className="text-gray-300 font-medium">Author: {Admin.username}</span>
                                    </div>
                                    
                                    <div className="relative h-6 flex gap-3 items-center text-gray-500" >
                                        <input 
                                            type="checkbox" 
                                            className="peer h-6 w-10 cursor-pointer appearance-none rounded-full border-2 border-gray-600 peer-checked:bg-gray-600 checked:border-gray-600 focus-visible:ring-2 focus-visible:ring-gray-500 checked:focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            value="Ongoing"
                                            onChange={handleCheckbox_status}
                                            checked
                                            disabled
                                        />
                                        <span className="pointer-events-none absolute start-1 top-1 block size-4 rounded-full bg-gray-500 transition-all duration-200 peer-checked:start-[1.375rem] peer-checked:bg-gray-500"></span>
                                        <span className="text-gray-500 font-medium">Ongoing (Default)</span> 
                                    </div>
                                </div>
                                {/* <div className="flex flex-col gap-2 p-5 w-[100%] bg-gray-600 rounded">
                                    <span className='text-amber-400'>Manga Story Progress</span>
                                    <div class="relative h-5 flex gap-2 items-center text-zinc-400 " >
                                        <input type="checkbox" 
                                            class="peer h-5 w-8 cursor-pointer appearance-none rounded-full border border-zinc-400 peer-checked:bg-zinc-400 checked:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-400 checked:focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            value="Ongoing"
                                            onChange={handleRadio_status}
                                            checked
                                            disabled
                                        />
                                        <span class="pointer-events-none absolute start-0.75 top-0.75 block size-[0.875rem] rounded-full bg-zinc-400 transition-all duration-200 peer-checked:start-[0.9375rem] peer-checked:bg-white"></span>
                                        <span>Ongoing</span> <span className='text-red-600 ml-2'>disabled</span>
                                    </div>
                                </div> */}
                                {/* <div className="flex flex-col gap-2 p-5 w-[100%] bg-gray-600 rounded">
                                    <span className='text-amber-400'>Author</span>
                                    <div class="relative h-5 flex gap-2 items-center" >
                                        <input type="checkbox" 
                                            class="peer h-5 w-8 cursor-pointer appearance-none rounded-full border border-zinc-400 peer-checked:bg-white checked:border-white focus-visible:ring-2 focus-visible:ring-zinc-400 checked:focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            value={Admin.username}
                                            onChange={handleAuthor_checkbox}
                                        />
                                        <span class="pointer-events-none absolute start-0.75 top-0.75 block size-[0.875rem] rounded-full bg-zinc-400 transition-all duration-200 peer-checked:start-[0.9375rem] peer-checked:bg-white"></span>
                                        {Admin.username}
                                    </div>
                                </div> */}
                            </div>
                            
                            {/* Right Column - Image Upload */}
                            <div className="relative w-full lg:w-[48%] h-fit">
                                {/* Upload Dropzone */}
                                <div 
                                    {...getRootProps()} 
                                    className={`bg-[#1a1a1a] hover:bg-[#222] transition-all duration-200 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer ${
                                        isDragActive ? 'border-amber-400 bg-amber-400/10' : 'border-amber-400/50'
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="material-symbols-outlined text-amber-400 text-5xl">
                                            {isDragActive ? 'cloud_done' : 'cloud_upload'}
                                        </span>
                                        <h1 className="text-amber-400 text-xl font-semibold">
                                            {isDragActive ? "Drop Images Here" : "Upload Images"}
                                        </h1>
                                        <p className="text-gray-400 text-sm text-center">
                                            {isDragActive ? "Release to upload" : "Drag and drop images here, or click to select"}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Image Preview Slider */}
                                {files?.length > 0 && (
                                    <div className="slider-container mt-6 bg-[#1a1a1a] p-6 rounded-lg border border-gray-700 shadow-lg">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-amber-400 font-semibold flex items-center gap-2">
                                                <span className="material-symbols-outlined">image</span>
                                                Preview ({files.length} {files.length === 1 ? 'image' : 'images'})
                                            </h3>
                                        </div>
                                        <Slider ref={sliderRef} {...settings}>
                                            {files.map(file => (
                                                <div key={file.name} className="relative">
                                                    <div className="overflow-auto scrollbar-hide h-[350px] flex items-center justify-center bg-[#2a2a2a] rounded-lg" id='container-images-preview'>
                                                        <img 
                                                            src={file.preview} 
                                                            alt={file.name} 
                                                            className="rounded-lg shadow-xl w-full h-auto transition-transform duration-200" 
                                                            style={{ transform: `scale(${zoomLevels[file.name] || .3})` }} 
                                                        />
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 font-bold text-lg" 
                                                        onClick={() => handleRemove(file.name)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </Slider>
                                        {/* Zoom Controls */}
                                        <div className="flex justify-center items-center gap-4 mt-6 p-4 bg-[#2a2a2a] rounded-lg">
                                            <button 
                                                type="button" 
                                                onClick={handleZoomOut} 
                                                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-all duration-200 font-bold text-lg shadow-md"
                                            >
                                                −
                                            </button>
                                            <span className="text-gray-300 font-medium min-w-[60px] text-center">Zoom</span>
                                            <button 
                                                type="button" 
                                                onClick={handleZoomIn} 
                                                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-all duration-200 font-bold text-lg shadow-md"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* <input type="submit" value="Add new manga" className='flex items-center justify-center  w-[50%] h-fit p-3 rounded cursor-pointer bg-amber-600 text-white hover:bg-amber-700 transition-all duration-200' /> */}
                        </form>
                        {loader && (
                            <div className='absolute w-full h-full top-0 left-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg'>
                                <div className='flex flex-col items-center gap-4'>
                                    <BeatLoader color="#fbbf24" size={15} />
                                    <p className='text-amber-400 font-semibold'>Creating manga...</p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Manga List Section */}
                    <section className='flex w-full flex-col gap-4 relative p-6'>
                        {/* Section Header with Search */}
                        <header className='bg-gradient-to-r from-amber-400 to-amber-500 p-4 rounded-lg flex items-center justify-between sticky top-0 z-10 shadow-lg' >
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-black">menu_book</span>
                                <label className='text-black font-bold text-lg'>Manga List</label>
                            </div>
                            <input 
                                type="search" 
                                name='search' 
                                onChange={search} 
                                placeholder='Search for manga...' 
                                className='bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black p-2 pl-10 w-64 shadow-md transition-all duration-200'
                            />
                        </header>
                        
                        {/* Delete Confirmation Prompt */}
                        {deletePrompt && (
                            <div className={`transition-all duration-300 ${deletePrompt ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} w-full flex justify-center items-center bg-gradient-to-r from-red-500 to-red-600 p-4 text-white rounded-lg shadow-xl sticky top-[70px] z-20`} id='promptDelete'>
                                <div className='flex flex-col sm:flex-row items-center gap-4 w-full'>
                                    <span className="flex items-center gap-2">
                                        <span className="material-symbols-outlined">warning</span>
                                        Are you sure you want to delete <span className='font-bold text-amber-300'>{mangaToTitleToDelete}</span>?
                                    </span>
                                    <div className='flex gap-3'>  
                                        <button 
                                            className='bg-white text-red-600 border-2 border-white px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-red-50 font-semibold shadow-md' 
                                            onClick={() => {setContinueDeleting(true); window.location.reload()}}
                                        >
                                            Continue
                                        </button>
                                        <button 
                                            className='bg-transparent text-white border-2 border-white px-4 py-2 rounded-lg hover:bg-white/20 cursor-pointer font-semibold transition-all' 
                                            onClick={() => { setContinueDeleting(false); setDeletePrompt(false); setSpecificMangaToDelete('');  setMangaTitleToDelete('')}} 
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Manga Table */}
                        <div className="overflow-x-auto rounded-lg border border-gray-700">
                            <table className='w-full' id='table'>
                                <thead className="bg-[#1a1a1a]">
                                    <tr>
                                        <th className="text-left text-gray-300 font-semibold p-4 border-b border-gray-700">Image</th>
                                        <th className="text-left text-gray-300 font-semibold p-4 border-b border-gray-700">Title</th>
                                        <th className="text-left text-gray-300 font-semibold p-4 border-b border-gray-700">Genre</th>
                                        <th className="text-left text-gray-300 font-semibold p-4 border-b border-gray-700">Chapters</th>
                                        <th className="text-left text-gray-300 font-semibold p-4 border-b border-gray-700">Status</th>
                                        <th className="text-left text-gray-300 font-semibold p-4 border-b border-gray-700">View Status</th>
                                        <th className="text-left text-gray-300 font-semibold p-4 border-b border-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-[#2a2a2a]'>
                                    {currentMangas && currentMangas.map((info) => (
                                        <tr key={info._id} className="border-b border-gray-700 hover:bg-[#333] transition-colors duration-200">
                                            <td className='p-4'>
                                                <img 
                                                    src={`http://localhost:5000${info.Chapters_idfk[0].images[0]}`} 
                                                    alt={info.title} 
                                                    className="w-16 h-24 object-cover rounded-lg shadow-md" 
                                                />
                                            </td>
                                            <td className='p-4'>
                                                <span className="text-white font-medium">{info.title}</span>
                                            </td>
                                            <td className='p-4'>
                                                <span className="text-gray-300 text-sm">
                                                    {(() => {
                                                        try {
                                                            const genreArray = typeof info.Genre === 'string' ? JSON.parse(info.Genre) : info.Genre;
                                                            return Array.isArray(genreArray) && genreArray.length > 0 ? genreArray.join(', ') : 'No Genres';
                                                        } catch (err) { 
                                                            return 'Invalid Genre Format'
                                                        }
                                                    })()}
                                                </span>
                                            </td>
                                            <td className='p-4'>
                                                <span className="text-gray-300 font-medium">{info.Chapters_idfk.length}</span>
                                            </td>
                                            <td className='p-4'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    info.Status?.toLowerCase().trim() === 'ongoing' 
                                                        ? 'bg-orange-400/20 text-orange-400 border border-orange-400/30' 
                                                        : 'bg-green-400/20 text-green-400 border border-green-400/30'
                                                }`}>
                                                    {info.Status}
                                                </span>
                                            </td>
                                            <td className='p-4'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    info.Published === 'Published'
                                                        ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                                                        : 'bg-orange-400/20 text-orange-400 border border-orange-400/30'
                                                }`}>
                                                    {info.Published}
                                                </span>
                                            </td>
                                            <td className='p-4'>
                                                <div className="flex items-center gap-3">
                                                    <Link 
                                                        to={`/edit-manga/${info._id}`}
                                                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </Link>
                                                    <Link 
                                                        to="" 
                                                        onClick={() => {
                                                            setSpecificMangaToDelete(info._id)
                                                            setMangaTitleToDelete(info.title)
                                                            setDeletePrompt(true);
                                                            setContinueDeleting(null);
                                                        }}
                                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200"
                                                        title="Delete"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </Link>
                                                    <Link 
                                                        to={`/view-manga/${info._id}`}
                                                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all duration-200"
                                                        title="View"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-4 py-6">
                            <button
                                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                                disabled={currentPage === 1}
                                className="bg-[#1a1a1a] hover:bg-[#222] text-white px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 font-semibold shadow-md"
                            >
                                Previous
                            </button>
                            <span className="text-gray-300 font-medium px-4">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="bg-[#1a1a1a] hover:bg-[#222] text-white px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 font-semibold shadow-md"
                            >
                                Next
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
