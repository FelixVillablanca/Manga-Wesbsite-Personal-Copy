
import { useState, useEffect, useCallback, useRef} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


//Styling file
import '../Styles/style.css'

//Components Import
import Sidebar from "../Components/Sidebar"; 

//Import essential packages for Elements used in this Component after installed in terminal like.. npm i react-dropzone
import { useDropzone } from "react-dropzone"; // for drag and drop file from NodePackageManagement website 
//=============
        import { Card, CardContent } from "@/components/ui/card"
        import {
            Carousel,
            CarouselContent,
            CarouselItem,
            CarouselNext,
            CarouselPrevious,
        } from "@/components/ui/carousel"
//=============


export default function SelectedChapterToVIew() {
        const navigateTo = useNavigate();

//   const hasReloaded = useRef(false); // ✅ flag to track reload

//   useEffect(() => {
//     if (!hasReloaded.current) {
//       hasReloaded.current = true;
//       window.location.reload();
//     }
//   }, []);


    //=====================================================================================
    //SETTING THE PARAMETERS 
        const { manga_id, chapter_id, indexChapter} = useParams()
        //FYI ~~~
        // ~ the index is the url parameter, and it's a index of the chapter that's been selected on the Select Chapter or Choices on the view_manga
        // ~ indexChapter = 0 

    //=====================================================================================
    
    
    //=====================================================================================
    //for auto scrolling at the top
    const scrollContainerRef = useRef(null); //scrollContainerRef - scrollContainerRef is a reference to a DOM element (like a div).

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    },[indexChapter]); 
    // if something changes in indexChapter, the argument inside will be triggered causing it to scroll at top of that element depending on where element it has called, 
    // like <div ref = {scrollContainerRef}> auto scroll at the top </div>

    //=====================================================================================


    //=====================================================================================
    //ADMIN SESSION
        const [Admin, setAdminCredentials] = useState([])
        useEffect(() => {
            const Admin_Token = localStorage.getItem("AdminCredentials");
            
            if (Admin_Token) {
                const decoded_Token_session = jwtDecode(Admin_Token);
                setAdminCredentials(decoded_Token_session)
            } else {
                navigateTo('/')
            }
        }, [])
    //=====================================================================================


    //=====================================================================================
    // AUTOMATICALLY FETCH THE DATA ON MANGA ~ CHAPTERS
        const [chaptersIDFK, setChaptersIDFK] = useState([])
        const [filesImages, setFilesImages] = useState([])
        const chapter_index = parseInt(indexChapter); // indexChapter value is = starting to 0 in Chapters_idfk
        // console.log('Chapter index: ', chapter_index) 

        useEffect(() => {
            const get_the_data_on_Chapters_idfk = async () => {
                try {
                    const response = await fetch(`/api/view_chapter_selected/${manga_id}`);
                    const dataResponse = await response.json();

                    if (dataResponse && Array.isArray(dataResponse.Chapters_idfk) && dataResponse.Chapters_idfk.length > 0) {
                        setChaptersIDFK(dataResponse.Chapters_idfk);
                        if (dataResponse.Chapters_idfk[chapter_index]) {
                            setFilesImages(dataResponse.Chapters_idfk[chapter_index].images);
                        }
                    }
                } catch (error) {
                    console.error('Failure on fetching: ', error);
                }
            };
            get_the_data_on_Chapters_idfk();
        }, [manga_id, chapter_index]);
        
        console.log('Images fetched: ', filesImages)
        console.log('Chapters fetched: ', chaptersIDFK)

    //=====================================================================================
    

    //=====================================================================================
    //for chapter selection div 
        const [chapterSelectorDiv, setChapterSelectorDiv] = useState(false)
        const toggleChapterSelectorDiv = () => {
            setChapterSelectorDiv(prev => !prev)
        }

    //=====================================================================================
    

    // window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top on chapter change
    //=====================================================================================
    //for current image viewing tracker e.g., 1 / 30
    const [currentIndexTrack, setCurrentIndexTrack] = useState(0);
    // setCurrentIndexTrack(0)
    useEffect(() => {
        
        const observers = [];
        
        filesImages.forEach((_, idx) => {
            const el = document.getElementById(`snap-img-${idx}`);
            if (!el) return;
            
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setCurrentIndexTrack(idx);
                    }
                },
                {
                    threshold: 0.3, // adjust sensitivity
                }
            );
            
            observer.observe(el);
            observers.push(observer);
        });
        
        return () => {
            observers.forEach(observer => observer.disconnect())
            // window.location.reload();
            // window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top on chapter change
        };
    }, [filesImages]);
    
    //=====================================================================================


    //=====================================================================================
    //ADD STORY
        const [toggleshow_AddStory, setToggleShow_AddStory] = useState(false)
        const [toggleshow_AddChapter, setToggleShow_AddChapter] = useState(false)
        const [filesAdded, setFilesAdded] = useState([])

        const toggleShow_AddStory = () => {
            setToggleShow_AddStory(prev => !prev)
            setFilesAdded([])
        }
        const toggleShow_Add_Chapter = () => {
            setToggleShow_AddChapter(prev => !prev)
            setFilesAdded([])
        }


        const onDrop = useCallback(acceptedFiles => {
            if (acceptedFiles?.length) {
                // Clean up old previews
                filesAdded.forEach(file => URL.revokeObjectURL(file.preview));
                
                const newFiles = acceptedFiles.map(file => ({ file, preview : URL.createObjectURL(file) })) //creates a new property on each file, for later use on img src
                setFilesAdded(newFiles)

                // setFilesAdded(acceptedFiles.map(file => {
                //     Object.assign(file, { preview: URL.createObjectURL(file) })
                // }))

            }
        }, [filesAdded])
        const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
        console.log('files added: ', filesAdded)

        const removeSelected_Preview = (previewFIle_toRemove) => {
            const newFile = filesAdded.filter(file => file.file.name != previewFIle_toRemove);
            setFilesAdded(newFile)
        }

    //============================================== Upload Story

        const  Upload_Added_Story = async (id) => {
            // console.log('id uploaded: ',id)
            const formdata = new FormData()

            filesAdded.forEach(file => formdata.append('New_Added_Images', file.file))

            const response = await fetch(`/api/NewAdded_Images/${id}`, {
                method : 'PUT',
                body : formdata
            })

            const result = await response.json();

            if (result) {
                // alert('Successfully Added')
                setFilesAdded([])
                console.log('Successfully Added')
                console.log('Successfull response: ', result)
                window.location.reload();
            }

        }

    //=====================================================================================


    //=====================================================================================
    //ADD NEW CHAPTER

        const Upload_Added_Chapter = async (id) => {
        // console.log('upload added chapter id: ', id)
            const formdata = new FormData();

            filesAdded.forEach(file => formdata.append('newChapter_images', file.file))
            // console.log('formdata: ', formdata)
            const result = await fetch(`/api/Added_newChapter/${id}`, {
                method : "POST",
                body : formdata
            })

            const response = await result.json();

            if (!response) {
                // alert(response.message)
                console.log('Failed Message: ', response.message)
            }
            window.location.reload();
            console.log('Successfull message: ', response.message)
        
        }
    
    
    //=====================================================================================

      const renderCount = useRef(0); // 🟨 create the sticky note

        useEffect(() => {
            renderCount.current += 1; // 🟦 update the sticky note
            console.log("Render count:", renderCount.current); // 🟩 read the sticky note
        });
        console.log(`This component has rendered ${renderCount.current} times.`)

    
    return(
        <div className="w-auto h-screen relative flex">
            <Sidebar Admin={Admin} adminSet={setAdminCredentials}/>
            <main className="w-full h-full p-5 text-white relative  flex" >
                <section className=" w-full flex flex-col relative">
                    <div ref={scrollContainerRef} className=" h-screen w-full overflow-y-scroll flex flex-col items-center scroll-smooth snap-y snap-mandatory snap-center " >
                        {filesImages.length === 0 ? (
                            <p>No images found.</p>
                        ) : (
                            filesImages.map((img, idx) => (
                                <img 
                                    className="w-[50%] h-screen snap-center object-contain"
                                    key={idx}
                                    id={`snap-img-${idx}`}
                                    src={`http://localhost:5000${img}`} 
                                    alt="manga" 
                                />
                            ))
                        )}

                    </div>
                    <footer className="flex flex-col w-[300px] h-auto gap-3 items-end absolute right-10 bottom-5 ">
                        <label className="flex gap-2 items-center"> 
                            Add Story
                            <button className="rounded-full border-2 w-[30px] h-[30px] text-center cursor-pointer" onClick={toggleShow_AddStory}>+</button>
                        </label>
                        <label className="flex gap-2 items-center"> 
                            Add Chapter 
                            <button className="rounded-full  border-2 w-[30px] h-[30px]  text-center cursor-pointer" onClick={toggleShow_Add_Chapter}>+</button>
                        </label>
                        <div className={`grid grid-cols-6 gap-4 ${chapterSelectorDiv ? 'max-h-[200px]' : 'hidden overflow-hidden p-0'}  w-full transition-all duration-300 rounded p-3 overflow-auto bg-[#2f3136]`}>
                            {chaptersIDFK.length > 0 && chaptersIDFK.map((chapters, index) => 
                                <Link className={`${index === chapter_index ? 'border border-amber-400' : 'border-none'} rounded p-2 cursor-pointer bg-gray-950 text-center`} 
                                    key={index} 
                                    to={`/SelectedChapter_ToBeView/${chapters.manga_idfk}/${chapters._id}/${index}`}
                                    // /SelectedChapter_ToBeView/:manga_id/:chapter_id/:indexOFchapter
                                >
                                    {index + 1}
                                </Link>
                            )}



                        
                            {/* <button className="border rounded p-2 cursor-pointer bg-gray-950">
                                2
                            </button>
                            <button className="border rounded p-2 cursor-pointer bg-gray-950">
                                3
                            </button>*/}
                        </div>
                        <div className=" bottom-10 flex flex-row items-center gap-4 ">
                            <span className="">
                                {/* 1 / 30 */}
                                {currentIndexTrack + 1} / {filesImages.length}
                            </span>
                            <span>of Chapter {chapter_index + 1}</span>
                            <button className="flex items-center border rounded cursor-pointer" onClick={toggleChapterSelectorDiv} >
                                <span class="material-symbols-outlined ">grid_on</span>
                            </button>
                        </div>
                    </footer>

                </section>

            </main>
            {toggleshow_AddStory &&(
                <div className="flex items-center justify-center rounded w-full h-screen absolute z-20 bg-black/80 ">
                    <section className={` ${filesAdded.length > 0 ? 'h-[80%] w-[60%] bg-white': 'h-[40%] w-[30%] bg-white/20'} transition-all duration-300 relative p-8 flex flex-wrap bg-white rounded overflow-hidden`}> {/* h-[40%] h-[80%]*/}
                        <div className={`relative transition-all duration-300 p-2 ${filesAdded.length > 0 ? 'w-[50%]' : 'w-full'}  h-full `}> {/*w-full w-[50%]*/}
                            <div {...getRootProps()} className={`bg-gray-800  hover:bg-gray-700 transition-colors duration-200 border-2 border-dashed border-amber-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer w-full duration-300 ${filesAdded.length > 0 ? 'h-[50%]': 'h-full'} `}> {/* h-[full] h-[50%] */}
                                <input {...getInputProps()} />
                                <h1 className="text-amber-400 text-lg font-semibold mb-2">Add Story for Chapter {chapter_index + 1}</h1>
                                <p className="text-gray-400 text-sm text-center">{isDragActive ? "Drop the files now..." : "Drag and drop image here, or click to select"}</p>
                            </div>
                            {filesAdded.length > 0 &&(
                                <div className="border h-[50%] overflow-auto p-5">
                                    {filesAdded.length > 0 ? (
                                        <>
                                                {filesAdded.map((file, index) => (
                                                    <li key={index} className="flex border w-full relative p-2 rounded odd:bg-gray-200">   {file.file.name} 
                                                    <span><button className="rounded-full w-5 h-5 border flex items-center justify-center absolute right-2" onClick={() => removeSelected_Preview(file.file.name)}><span class="material-symbols-outlined text-red-500 cursor-pointer">cancel</span></button></span></li>
                                                ))}

                                        </>
                                    ) : (
                                        <>
                                            <span>No file</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {filesAdded.length > 0 &&(
                            <div className=" w-[50%] h-full relative flex items-center transition-all duration-1000 justify-center overflow-hidden">
                                {filesAdded.length > 0 ? (
                                    <Carousel className="w-full relative border-none h-full flex items-center justify-center rounded bg-[#2f3136]">
                                            <CarouselContent className="border-none ">
                                                {filesAdded.map((file, index) => (
                                                    <CarouselItem key={index} className="border-none">
                                                    <Card className="bg-transparent flex border-none h-full relative ">
                                                        <CardContent className="flex aspect-square items-center justify-center  rounded  border-none">
                                                        <img 
                                                            src={file.preview} alt={file.name}
                                                            className="object-contain w-full h-full rounded "
                                                        />
                                                        </CardContent>
                                                    </Card>
                                                </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="absolute left-4 " />
                                            <CarouselNext className="absolute right-4 "/>
                                            </Carousel>
                                ) : (
                                    <span className="text-2xl font-semibold flex items-center ">No image</span> 
                                )}
                            </div>
                        )}
                        <button className={`absolute right-2 top-2 hover:text-gray-300 cursor-pointer ${filesAdded.length > 0 ? 'text-black' : 'text-white'}`} onClick={toggleShow_AddStory}>
                            <span class="material-symbols-outlined">close</span>
                        </button>
                        {filesAdded.length > 0 && (
                            <button className="transition-all duration-300 absolute w-[30%] h-[40px] flex items-center justify-center rounded bg-blue-300 right-33 bottom-10 hover:bg-blue-200 cursor-pointer"
                                onClick={() => Upload_Added_Story(chaptersIDFK[chapter_index]._id)}
                            >
                                <span class="material-symbols-outlined text-blue-600">upload</span>
                            </button>
                        )}
                    </section>
                </div>
            )}
                {/* For Add Chapter */}
            {toggleshow_AddChapter &&(
                <div className="flex items-center justify-center rounded w-full h-screen absolute z-20 bg-black/80 ">
                    <section className={` ${filesAdded.length > 0 ? 'h-[80%] w-[60%] bg-white': 'h-[40%] w-[30%] bg-white/20'} transition-all duration-300 relative p-8 flex flex-wrap  rounded overflow-hidden`}>
                        <div className={`relative transition-all duration-300 p-2 ${filesAdded.length > 0 ? 'w-[50%]' : 'w-full'}  h-full `}> {/*w-full w-[50%]*/}
                            <div {...getRootProps()} className={`bg-gray-800  hover:bg-gray-700 transition-colors duration-200 border-2 border-dashed border-amber-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer w-full duration-300 ${filesAdded.length > 0 ? 'h-[50%]': 'h-full'} `}> {/* h-[full] h-[50%] */}
                                <input {...getInputProps()} />
                                <h1 className="text-amber-400 text-lg font-semibold mb-2">Upload Story for new chapter </h1> {/* {chapter_index + 1} to be fix */}
                                <p className="text-gray-400 text-sm text-center">{isDragActive ? "Drop the files now..." : "Drag and drop image here, or click to select"}</p>
                            </div>
                            {filesAdded.length > 0 &&(
                                <div className="border h-[50%] overflow-auto p-5">
                                    {filesAdded.length > 0 ? (
                                        <>
                                                {filesAdded.map((file, index) => (
                                                    <li key={index} className="flex border w-full relative p-2 rounded odd:bg-gray-200">   {file.file.name} 
                                                    <span><button className="rounded-full w-5 h-5 border flex items-center justify-center absolute right-2" onClick={() => removeSelected_Preview(file.file.name)}><span class="material-symbols-outlined text-red-500 cursor-pointer">cancel</span></button></span></li>
                                                ))}

                                        </>
                                    ) : (
                                        <>
                                            <span>No file</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {filesAdded.length > 0 &&(
                            <div className=" w-[50%] h-full relative flex items-center transition-all duration-1000 justify-center overflow-hidden">
                                {filesAdded.length > 0 ? (
                                    <Carousel className="w-full relative border-none h-full flex items-center justify-center rounded bg-[#2f3136]">
                                            <CarouselContent className="border-none ">
                                                {filesAdded.map((file, index) => (
                                                    <CarouselItem key={index} className="border-none">
                                                    <Card className="bg-transparent flex border-none h-full relative ">
                                                        <CardContent className="flex aspect-square items-center justify-center  rounded  border-none">
                                                        <img 
                                                            src={file.preview} alt={file.name}
                                                            className="object-contain w-full h-full rounded "
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="absolute left-4 " />
                                            <CarouselNext className="absolute right-4 "/>
                                            </Carousel>
                                ) : (
                                    <span className="text-2xl font-semibold flex items-center ">No image</span> 
                                )}
                            </div>
                        )}
                        <button className={`absolute right-2 top-2 hover:text-gray-300 cursor-pointer ${filesAdded.length > 0 ? 'text-black' : 'text-white'}`} onClick={toggleShow_Add_Chapter}>
                            <span class="material-symbols-outlined">close</span>
                        </button>
                        {filesAdded.length > 0 && (
                            <button className="transition-all duration-300 absolute w-[30%] h-[40px] flex items-center justify-center rounded bg-blue-300 right-33 bottom-10 hover:bg-blue-200 cursor-pointer"
                                onClick={() => Upload_Added_Chapter(manga_id)}
                            >
                                <span class="material-symbols-outlined text-blue-600">upload</span>
                            </button>
                        )}
                        {/* <div>
                            div preview picture
                            </div>
                            <div>
                            div remove image
                            </div> */}
                    </section>
                </div>
            )}
        </div>
    );
}
