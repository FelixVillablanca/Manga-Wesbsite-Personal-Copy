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
    const [Author, setAuthor] = useState('Anonymous Author');
    const handleAuthor_checkbox = (event) => event.target.checked ? setAuthor(event.target.value) : setAuthor("Anonymous Author")

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
        <div className='w-auto h-screen relative flex'>
            <Sidebar Admin={Admin} adminSet={setAdminCredentials}/>
            <main className='w-full h-full p-5 text-white relative'>
                <div className="bg-[#2f3136] relative w-auto h-full overflow-auto " id='container_addmanga'>
                <div className="bg-amber-400 "><header className='p-5'>Add Manga</header></div>
                    <section className="flex flex-wrap relative w-full">
                        <form className="p-5 flex flex-wrap gap-5 relative w-full h-[85%] justify-center" onSubmit={handleSubmit}>
                            <label className="flex gap-4 items-center relative w-full h-fit ">
                                Title : <input type="text" name="Title" className="shadow focus:outline-none bg-white rounded text-black p-2 w-[40%]" required/>
                                {/* <Spinner/> */}
                                <input type="submit" value="+" className='flex items-center justify-center text-center w-[30px] h-[30px] absolute right-1 rounded cursor-pointer bg-amber-600 text-white hover:bg-amber-700 transition-all duration-200' />
                            </label>
                            <div className="relative w-[50%] gap-2 flex flex-col  h-fit">
                                <div className="relative gap-3.5 w-[100%] p-5 bg-gray-600 rounded">
                                    <span className='text-amber-400'>Set Genres</span>
                                    <div className="w-[100%] flex flex-wrap p-3 gap-2">
                                        {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-fi', 'Thriller'].map(genre => (
                                            <label key={genre} className="flex items-center gap-1 h-auto rounded bg-white text-black p-2 cursor-pointer">
                                                {/* <input type="checkbox" name="genre" value={genre} checked={selectedGenres.includes(genre)} onChange={handleCheckbox_genre} className=''/> */}
                                                <input type="checkbox" defaultChecked 
                                                    className="checkbox bg-amber-50 " 
                                                    value={genre} 
                                                    checked={selectedGenres.includes(genre)} 
                                                    onChange={handleCheckbox_genre}
                                                />
                                                {genre}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative flex flex-col gap-2 w-[100%] p-5 bg-gray-600 rounded">
                                    <span className='text-amber-400'>Story Settings</span>
                                    {/* {['Published', 'Unpublished'].map((publishedStatus) => (
                                        <label key={publishedStatus} className='flex gap-2'>
                                        <input type='radio' name='OnPublishedStatus' value={publishedStatus} onChange={handlePublished_Status} checked={Published.includes(publishedStatus)}/>
                                        {publishedStatus}
                                        </label>
                                        ))} */}
                                    
                                    <div className="relative h-5 flex gap-2 items-center" >
                                        <input type="checkbox" className="peer h-5 w-8 cursor-pointer appearance-none rounded-full border border-zinc-400 peer-checked:bg-white checked:border-white focus-visible:ring-2 focus-visible:ring-zinc-400 checked:focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            value="Published" onChange={handlePublished_Status} checked={Published.includes("Published")}/>
                                        <span className="pointer-events-none absolute start-0.75 top-0.75 block size-[0.875rem] rounded-full bg-zinc-400 transition-all duration-200 peer-checked:start-[0.9375rem] peer-checked:bg-white"></span>
                                        <span>Published</span>
                                    </div>
                                    <div className="relative h-5 flex gap-2 items-center" >
                                        <input type="checkbox" 
                                            className="peer h-5 w-8 cursor-pointer appearance-none rounded-full border border-zinc-400 peer-checked:bg-white checked:border-white focus-visible:ring-2 focus-visible:ring-zinc-400 checked:focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            value={Admin.username}
                                            onChange={handleAuthor_checkbox}
                                        />
                                        <span className="pointer-events-none absolute start-0.75 top-0.75 block size-[0.875rem] rounded-full bg-zinc-400 transition-all duration-200 peer-checked:start-[0.9375rem] peer-checked:bg-white"></span>
                                        {Admin.username}
                                    </div>
                                    <div className="relative h-5 flex gap-2 items-center text-zinc-400 " >
                                        <input type="checkbox" 
                                            className="peer h-5 w-8 cursor-pointer appearance-none rounded-full border border-zinc-400 peer-checked:bg-zinc-400 checked:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-400 checked:focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            value="Ongoing"
                                            onChange={handleCheckbox_status}
                                            checked
                                            disabled
                                        />
                                        <span className="pointer-events-none absolute start-0.75 top-0.75 block size-[0.875rem] rounded-full bg-zinc-400 transition-all duration-200 peer-checked:start-[0.9375rem] peer-checked:bg-zinc-400"></span>
                                        <span>Ongoing</span> 
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
                            <div className="relative w-full max-w-xl h-fit ">
                                <div {...getRootProps()} className='bg-gray-700 hover:bg-gray-600 transition-colors duration-200 border-2 border-dashed border-amber-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer '>
                                    <input {...getInputProps()} />
                                    <h1 className="text-amber-400 text-lg font-semibold mb-2">Upload Image Here</h1>
                                    <p className="text-white text-sm text-center">{isDragActive ? "Drop the files now..." : "Drag and drop image here, or click to select"}</p>
                                </div>
                                {files?.length > 0 && (
                                    <div className="slider-container mt-4 bg-[#1a1a1a] p-4 rounded-lg">
                                        <Slider ref={sliderRef} {...settings}>
                                            {files.map(file => (
                                                <div key={file.name} className="relative">
                                                    <div className="overflow-auto scrollbar-hide h-[300px] flex items-center justify-center" id='container-images-preview'>
                                                        <img src={file.preview} alt={file.name} className="rounded shadow-md w-full h-auto transition-transform duration-200" style={{ transform: `scale(${zoomLevels[file.name] || .3})` }} />
                                                    </div>
                                                    <button type="button" className="absolute top-[10px] right-[20px] z-10 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border hover:bg-blue-700" onClick={() => handleRemove(file.name)}>×</button>
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className="flex justify-center items-center gap-4 mt-12">
                                            <button type="button" onClick={handleZoomOut} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">-</button>
                                            <span>Zoom</span>
                                            <button type="button" onClick={handleZoomIn} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">+</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* <input type="submit" value="Add new manga" className='flex items-center justify-center  w-[50%] h-fit p-3 rounded cursor-pointer bg-amber-600 text-white hover:bg-amber-700 transition-all duration-200' /> */}
                        </form>
                        {loader && <div className='absolute w-full h-full top-0 bg-black/50 flex items-center justify-center'><BeatLoader color="#ffffff" size={10} /></div>}
                    </section>



                    <section className='flex w-full flex-col gap-2 relative'>
                        <header className='p-5 bg-amber-400 w-full sticky top-0' >
                            <label>Manga</label>
                            <input type="search" name='search' onChange={search} placeholder='Search for manga..' className=' bg-white rounded focus:outline-none text-black p-1 pl-2 cursor-pointer absolute right-5'/>

                        </header>
                        
                        {deletePrompt && (
                            <div className={` transition-all duration-300 ${deletePrompt ? 'h-[50px]' : 'h-0 overflow-hidden'} w-full flex justify-center items-center bg-white p-2 text-black sticky top-[60px]`} id='promptDelete'>
                                <div className='flex gap-5'>
                                    <span>Are you sure you want to delete this? <span className='text-amber-700 '>{mangaToTitleToDelete}</span></span>
                                    <span className='flex gap-2'>  
                                        <button className='bg-white text-black border pl-2 pr-2 rounded   cursor-pointer transition-all' 
                                            onClick={() => {setContinueDeleting(true); window.location.reload()}}>
                                                Continue
                                        </button>
                                        <button className='bg-black text-white border pl-2 pr-2 rounded hover:bg-gray-800 cursor-pointer' 
                                                onClick={() => { setContinueDeleting(false); setDeletePrompt(false); setSpecificMangaToDelete('');  setMangaTitleToDelete('')}} >
                                                Cancel
                                        </button>
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        <table className='w-full' id='table'>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Genre</th>
                                    <th>Chapters</th>
                                    <th>Status</th>
                                    <th>View Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {currentMangas && currentMangas.map((info) => (
                                        <tr key={info._id}>
                                            <td className=''><img src={`http://localhost:5000${info.Chapters_idfk[0].images[0]}`} alt={info.title} className="w-16 h-24 object-cover " /></td>
                                            <td>{info.title}</td>
                                            {/* <td>{Array.isArray(info.Genres) ? info.Genres.join(', ') : ''}</td> */}
                                            <td>{(() => {
                                                    try {
                                                        const genreArray = typeof info.Genre === 'string' ? JSON.parse(info.Genre) : info.Genre;
                                                        return Array.isArray(genreArray) && genreArray.length > 0 ? genreArray.join(', ') : 'No Genres';
                                                    } catch (err) { 
                                                        return 'Invalid Genre Format'
                                                    }
                                                })()
                                            }</td>
                                            <td>{info.Chapters_idfk.length}</td>
                                            {/* {console.log('status: ', info.Status)} */}
                                            <td  ><span className={`${info.Status?.toLowerCase().trim() === 'ongoing' ? 'text-orange-400' : 'text-green-600'} `}>{info.Status}</span></td>
                                            <td>{info.Published}</td>
                                            <td className=''>
                                                <div className="tooltip tooltip-warning" data-tip="Edit">
                                                    <Link to={`/edit-manga/${info._id}`}>
                                                        <span className="material-symbols-outlined hover:text-green-800">edit</span>
                                                    </Link>
                                                </div>
                                                <div className="tooltip tooltip-warning" data-tip="Delete">
                                                    <Link to="" onClick={() => {
                                                                            // deleteSync(info._id);
                                                                            setSpecificMangaToDelete(info._id)
                                                                            setMangaTitleToDelete(info.title)
                                                                            setDeletePrompt(true);
                                                                            setContinueDeleting(null);
                                                                        }}>
                                                        <span className="material-symbols-outlined hover:text-red-600">delete

                                                        </span>
                                                    </Link>
                                                </div>
                                                <div className="tooltip tooltip-warning" data-tip="View">
                                                    <Link to={`/view-manga/${info._id}`}>
                                                        <span className="material-symbols-outlined">view_day</span>
                                                    </Link>
                                                </div>
                                                
                                            </td>
                                        </tr>
                                    )
                                )}

                            </tbody>
                        </table>



                        <div className="flex justify-center items-center gap-4 py-4">
                            <button
                                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                                disabled={currentPage === 1}
                                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-white">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
