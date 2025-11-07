import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BeatLoader } from 'react-spinners';
import Sidebar from '../Components/Sidebar';
import '../Styles/style.css';



// MAJOR IMPORTS
import { jwtDecode } from 'jwt-decode';


export default function Edit_Manga() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [manga, setManga] = useState(null);
    const [title, setTitle] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    
    const [statusCheckbox, setStatusCheckbox] = useState('');
    const [Published, setPublished] = useState('Unpublished');
    const [Author, setAuthor] = useState('Anonymous Author');

    const [files, setFiles] = useState([]); 
    const [zoomLevels, setZoomLevels] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loader, setLoader] = useState(false);
    const sliderRef = useRef(null);


    //FOR ADMIN SESSION
    const [Admin, setAdmin] = useState([])
    useEffect(() => {
        const get_Admin_Token = localStorage.getItem('AdminCredentials')

        if (get_Admin_Token) {
            const decrypt_Admin_Token = jwtDecode(get_Admin_Token) //it's like a decryption in jwtwebtoken
            setAdmin(decrypt_Admin_Token)
        } else {
            navigate('/');
        }
        
        
    },[])

    //===================================================

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const response = await fetch(`/api/get_manga/${id}`);
                const data = await response.json();
                console.log('data', data)
                // console.log('data 2', data.Chapters_idfk[0].images.map(file => 'haha'))
                setManga(data);
                setTitle(data.title);
                setSelectedGenres(JSON.parse(data.Genre));
                setStatusCheckbox(data.Status); 
                setPublished(data.Published);
                setAuthor(data.Author);
                setFiles(data.Chapters_idfk[0].images.map(img => ({
                    preview: `http://localhost:5000${img}` //setting the blob:http://localhost:3000/789f20c2-2af2-43ca-8033-b0dda623d47c to http://localhost:5000/uploads/1761762361323-1_2.jpg
                })));
                data.Images.forEach(images => {
                    console.log('from set Files: ', images)
                    
                });
            } catch (error) {
                console.error('Failed to fetch manga:', error);
            }
        };
        fetchManga();
    }, [id]);
    console.log('check files updated: ', files)

    //for multiple file uploads image
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            setFiles(acceptedFiles.map(file =>
                Object.assign(file, { preview: URL.createObjectURL(file) })
            ));
            setZoomLevels({});
        }
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    //for checkbox
    const handleCheckbox_genre = (event) => {
        const { value, checked } = event.target;
        setSelectedGenres(prev => checked ? [...prev, value] : prev.filter(g => g !== value));
    };

    //for published/unpublished
    const handlePublished_radio = (event) =>setPublished (event.target.value)

    //for radio elements
    const handleCheckbox_status = (event) => setStatusCheckbox(event.target.checked ? "Ongoing" : "Completed");

    const handlePublished_Status = (event) => event.target.checked ? setPublished(event.target.value) : setPublished('Unpublished');

    const handleAuthor_checkbox = (event) => setAuthor(event.target.checked ? Admin.username : "Anonymous Author");

    const handleRemove = (nameToRemove) => {
        const newFiles = files.filter(file => file.name !== nameToRemove);
        setFiles(newFiles);
    };

    //for zoom in
    const handleZoomIn = () => {
        if (files.length === 0) return;
        const currentFile = files[currentSlide];
        setZoomLevels(prev => ({
            ...prev,
            [currentFile.name]: (prev[currentFile.name] || 1) + 0.1
        }));
    };

    //for zoom out
    const handleZoomOut = () => {
        if (files.length === 0) return;
        const currentFile = files[currentSlide];
        setZoomLevels(prev => ({
            ...prev,
            [currentFile.name]: Math.max(0.1, (prev[currentFile.name] || 1) - 0.1)
        }));
    };

    //for handling update button
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('genres', JSON.stringify(selectedGenres));
        formdata.append('status', statusCheckbox);
        formdata.append('Published_Status', Published);
        formdata.append('Set_Author', Author)       

        files.forEach(file => {
            console.log('files Array: ', file)
            // When editing, the `files` array contains a mix of existing image URLs (e.g., http://...)
            // and newly uploaded files, which are represented as blob URLs (e.g., blob:http://...).
            // This check ensures that we only append the *new* files to the FormData object.
            // The backend will then process these new files and replace the old ones.
            if (file.preview.startsWith('blob:')) {
                formdata.append('pre_images', file);
                
                console.log('check files updated: ', file.preview)
            }
        });

        try {
            setLoader(true);
            const response = await fetch(`/api/update_manga/${id}`, {
                method: 'PUT',
                body: formdata
            });
            const res = await response.json();
            if (res) {
                setTimeout(() => {
                    setLoader(false);
                    navigate('/Add_Manga');
                }, 3000);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // const settings = {
    //     customPaging: i => (
    //         <a><img src={files[i]?.preview} alt={`thumbnail-${i}`} className="w-full h-full object-cover" /></a>
    //     ),
    //     dots: true,
    //     dotsClass: "slick-dots slick-thumb",
    //     infinite: files.length > 1,
    //     speed: 500,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     afterChange: index => setCurrentSlide(index)
    // };
    const settings = {
        customPaging: function (i) {
            return (
            <a>
                <img
                src={files[i]?.preview}
                alt={`thumb-${i}`}
                className="w-12 h-12 object-cover rounded"
                />
            </a>
            );
        },
        dots: true,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        };

    if (!manga) {
        return <div className="w-full h-screen flex items-center justify-center"><BeatLoader color="#ffffff" /></div>;
    }

    return (
        <div className='w-auto h-full relative flex'>
            <Sidebar Admin={Admin} setAdmin={setAdmin}/>
            <main className='w-full h-full p-5 text-white relative'>
                <div className="bg-[#2f3136] relative w-auto h-full overflow-auto " id='container_addmanga'>
                <div className="bg-gray-600 sticky top-0 z-10 p-5"><header className='p-2'>Edit Manga</header></div>
                    <section className="flex flex-wrap relative w-full">
                        <form className="p-5 flex flex-wrap gap-5 relative w-full h-[85%] justify-center" onSubmit={handleSubmit}>
                            <label className="flex gap-4 items-center relative w-full h-fit">
                                Title : <input type="text" name="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="shadow focus:outline-none bg-white rounded text-black p-2 w-[40%]" required />
                            </label>
                            <div className="relative w-[50%] gap-2 flex flex-col  h-fit">
                                <div className="relative gap-3.5 w-full p-5 bg-gray-600 rounded">
                                    <span className='text-amber-400'>Set Genres</span>
                                    <div className="w-full flex flex-wrap p-5 gap-2">
                                        {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-fi', 'Thriller'].map(genre => (
                                            <label key={genre} className="flex items-center gap-1 h-[25px] rounded bg-white text-black p-2">
                                                {/* <input type="checkbox" name="genre" value={genre} checked={selectedGenres.includes(genre)} onChange={handleCheckbox_genre} /> */}
                                                <input type="checkbox" defaultChecked 
                                                    className="checkbox bg-amber-50 transform duration-150 " 
                                                    value={genre} 
                                                    checked={selectedGenres.includes(genre)} 
                                                    onChange={handleCheckbox_genre}
                                                />
                                                {genre}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative gap-3.5 -w-full p-5 bg-gray-600 rounded"> 
                                    <span className='text-amber-400'>Story Settings</span>
                                    <div class="relative h-5 flex gap-2 items-center" >
                                        <input type="checkbox" class="peer h-5 w-8 cursor-pointer appearance-none rounded-full border border-zinc-400 peer-checked:bg-white checked:border-white focus-visible:ring-2 focus-visible:ring-zinc-400 checked:focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            value="Published" onChange={handlePublished_Status} checked={Published.includes("Published")}/>
                                        <span class="pointer-events-none absolute start-0.75 top-0.75 block size-[0.875rem] rounded-full bg-zinc-400 transition-all duration-200 peer-checked:start-[0.9375rem] peer-checked:bg-white"></span>
                                        <span>Published</span>
                                    </div>
                                    <div class="relative h-5 flex gap-2 items-center" >
                                        <input type="checkbox" 
                                            class="peer h-5 w-8 cursor-pointer appearance-none rounded-full border border-zinc-400 peer-checked:bg-white checked:border-white focus-visible:ring-2 focus-visible:ring-zinc-400 checked:focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            value={Admin.username}
                                            onChange={handleAuthor_checkbox}
                                            checked={Author === Admin.username}
                                        />
                                        <span class="pointer-events-none absolute start-0.75 top-0.75 block size-[0.875rem] rounded-full bg-zinc-400 transition-all duration-200 peer-checked:start-[0.9375rem] peer-checked:bg-white"></span>
                                        {Admin.username}
                                    </div>
                                    <div class="relative h-5 flex gap-2 items-center  " >
                                        <input type="checkbox" 
                                            class="peer h-5 w-8 cursor-pointer appearance-none rounded-full border border-zinc-400 peer-checked:bg-zinc-400 checked:border-white focus-visible:ring-2 focus-visible:ring-zinc-400 checked:focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            value="Ongoing"
                                            onChange={handleCheckbox_status}
                                            checked={statusCheckbox === "Ongoing"}

                                        />
                                        <span class="pointer-events-none absolute start-0.75 top-0.75 block size-[0.875rem] rounded-full bg-zinc-400 transition-all duration-200 peer-checked:start-[0.9375rem] peer-checked:bg-white "></span>
                                        <span>Ongoing</span> 
                                    </div>
                                </div>
                                {/* <div className="relative flex flex-col gap-2 w-[100%] p-5 bg-gray-600 rounded">
                                    <span className='text-amber-400'>Publication Status</span>
                                    {['Published', 'Unpublished'].map(setting_published => (
                                        <label className='flex gap-2' key={setting_published}>
                                            <input type="radio" value={setting_published} onChange={handlePublished_radio} checked={Published.includes(setting_published)}/>
                                            {setting_published}
                                        </label>
                                    ))}
                                </div> */}
                                {/* <div className="flex flex-col gap-2 p-5 w-[100%] bg-gray-600 rounded">
                                    <span className='text-amber-400'>Manga Story Progress</span>
                                    <label className="flex items-center gap-1 h-[25px] w-fit rounded bg-white text-black p-2 cursor-pointer">
                                        <input type="radio" name="Status" value="Ongoing" checked={statusRadio === "Ongoing"} onChange={handleRadio_status} required />
                                        Ongoing
                                    </label>
                                    <label className="flex items-center gap-1 h-[25px] w-fit rounded bg-white text-black p-2 cursor-pointer">
                                        <input type="radio" name="Status" value="Completed" checked={statusRadio === "Completed"} onChange={handleRadio_status} />
                                        Completed
                                    </label>
                                </div>               */}
                                {/* <div className="flex flex-col gap-2 p-5 w-[100%] bg-gray-600 rounded">
                                    <span className='text-amber-400'>Author</span>
                                    {[Admin.username, 'Anonymous Author'].map(setting_author => (
                                        <label className='flex gap-2'>
                                            <input type="radio" value={setting_author} onChange={handleAuthor_radio} checked={Author.includes(setting_author)}/>
                                            {setting_author}
                                        </label>
                                    ))}
                                </div> */}

                            </div>
                            <div className="relative w-full max-w-xl h-fit">
                                <div {...getRootProps()} className='bg-gray-700 hover:bg-gray-600 transition-colors duration-200 border-2 border-dashed border-blue-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer'>
                                    <input {...getInputProps()} />
                                    <h1 className="text-blue-300 text-lg font-semibold mb-2">Upload Image Here</h1>
                                    <p className="text-white text-sm text-center">{isDragActive ? "Drop the files now..." : "Drag and drop image here, or click to select"}</p>
                                </div>
                                {files?.length > 0 && (
                                    <div className="slider-container mt-4 bg-[#1a1a1a] p-4 rounded-lg">
                                        <Slider ref={sliderRef} {...settings}>
                                            {files.map((file, index) => (
                                                <div key={index} className="relative ">
                                                    <div className={` overflow-auto h-[300px] flex items-center justify-center scrollbar-hide`} id='container-images-preview'>
                                                        <img src={file.preview} alt={file.name || `preview-${index}`} className="rounded shadow-md w-full h-auto transition-transform duration-200" style={{ transform: `scale(${zoomLevels[file.name] || .3})` }} />
                                                    </div>
                                                    {file.name &&
                                                        <button type="button" className="absolute top-[10px] right-[20px] z-10 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border hover:bg-blue-700" onClick={() => handleRemove(file.name)}>×</button>
                                                    }
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className="flex justify-center items-center gap-4 mt-12">
                                            <button type="button" onClick={handleZoomOut} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">-</button>
                                            <span>Zoom</span>
                                            <button type="button" onClick={handleZoomIn} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">+</button>
                                        </div>
                                    </div>
                                    // <div className="slider-container mt-6 bg-gray-900 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
                                    //     <Slider ref={sliderRef} {...settings}>
                                    //         {files.map((file, index) => (
                                    //         <div key={index} className="relative">
                                    //             <div className="h-[500px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-800">
                                    //             <img
                                    //                 src={file.preview}
                                    //                 alt={file.name || `preview-${index}`}
                                    //                 className="max-h-full max-w-full object-contain transition-transform duration-200"
                                    //                 style={{ transform: `scale(${zoomLevels[file.name] || 0.3})` }}
                                    //             />
                                    //             </div>
                                    //             {file.name && (
                                    //             <button
                                    //                 type="button"
                                    //                 className="absolute top-4 right-4 z-10 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition"
                                    //                 onClick={() => handleRemove(file.name)}
                                    //             >
                                    //                 ×
                                    //             </button>
                                    //             )}
                                    //         </div>
                                    //         ))}
                                    //     </Slider>

                                    //     <div className="flex justify-center items-center gap-6 mt-8">
                                    //         <button
                                    //         type="button"
                                    //         onClick={handleZoomOut}
                                    //         className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                                    //         >
                                    //         −
                                    //         </button>
                                    //         <span className="text-white font-medium">Zoom</span>
                                    //         <button
                                    //         type="button"
                                    //         onClick={handleZoomIn}
                                    //         className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                                    //         >
                                    //         +
                                    //         </button>
                                    //     </div>
                                    //     </div>

                                )}
                            </div>
                            <input type="submit" value="Update Manga" className='flex items-center justify-center  w-[50%] h-fit p-3 rounded cursor-pointer bg-amber-600 text-white hover:bg-amber-700 transition-all duration-200' />
                        </form>
                        {loader && <div className='absolute w-full h-full top-0 flex items-center justify-center'><BeatLoader color="#ffffff" size={10} /></div>}
                    </section>
                </div>
            </main>
        </div>
    );
}
