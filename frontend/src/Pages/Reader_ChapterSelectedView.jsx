import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';

//Imports Components
import Header from '../Components/Header';

import { jwtDecode } from 'jwt-decode';

import '../Styles/style.css'


export default function ReaderChapterSelectedView() {
    const navigateTo = useNavigate();
    const { manga_id, chapter_id } = useParams();
    // ======================================================
    //READER SESSION
    const [ReaderCredentials, setreaderCredentials] = useState(null);
    useEffect(() => {
        const getReader_Token = () => {
            const Token = localStorage.getItem('Reader_Credentials');
            
            if (Token) {
                const decoded_reader_token =  jwtDecode(Token)
                setreaderCredentials(decoded_reader_token)
            } else {
                navigateTo('/')
            }
        }
        getReader_Token();
    },[])

    console.log('ReaderCredentials : ', ReaderCredentials)

    useEffect(() => {
        if (ReaderCredentials && manga_id) {
            console.log('✅ Ready to check liked status');
        }
    }, [ReaderCredentials, manga_id]);

    // const handleLogout = () => {
    //     localStorage.removeItem('Reader_Credentials')
    //     setreaderCredentials(null)
    //     navigateTo('/')
    // }
    // ======================================================
    //FETCH ALL MANGA
    // const [all_manga, setAll_Manga] = useState([])
    // useEffect(() => {
    //     const All_MangaFetch = async () => {
    //         try {
    //             const result = await fetch('/api/get_Mangas', {
    //                 method : 'GET'
    //             })

    //             const response = await result.json();
    //             if (response) {
    //                 setAll_Manga(response)
    //             }
    //         } catch (error) {
    //             console.error('From frontend received an Error: ', error)
    //         }
    //     }
    //     All_MangaFetch()
    // },[])

    // console.log('all manga: ', all_manga)





    // ======================================================

    // ======================================================
    // AUTOFETCH THE MANGA 
    const [Manga, setManga] = useState({})
    const continueAdd = true;
    useEffect(() => {
        const Manga = async () => {
            if (ReaderCredentials) {
                try {
                    const result = await fetch(`/api/get_manga/${manga_id}/${ReaderCredentials.id}/${continueAdd}`, {
                        method : 'GET',
                    }) 
                    
                    const response = await result.json();
                    
                    if (response) {
                        setManga(response)
                    } 
                    
                } catch (error) {
                    console.error('From frontend received an error: ', error)
                }
            }
        }
        Manga();
    },[manga_id, ReaderCredentials])
    // console.log('manga: ', Manga)

    // ======================================================
    // FETCH THE CHAPTER
    const [chapter, setChapter] = useState([])
    useEffect(() => {
        const chapterFunc = async () => {
            try {
                const result = await fetch(`/api/reader_GetChapter/${chapter_id}`, {
                    method : 'GET'
                })
                const response = await result.json();
                if (response) {
                    setChapter(response)
                }
                
            } catch (error) {
                console.error('From frontend reader_chapter received an error: ', error  )
            }
        }
        chapterFunc();
    },[chapter_id]) 
    
    // console.log('chapter: ', chapter)
    // ======================================================

    // ==========================================================================================================================================> Start Footer
    // For Chapter tracker
    
    const [indexOFmanga, setIndexOfManga] = useState()
    // const index = 0;
    useEffect(() => {
        if (Manga && chapter_id) {
            const index = Manga.Chapters_idfk?.findIndex(chap => chap._id === chapter_id); //Starting 0
            if (index !== -1) {
                setIndexOfManga(index + 1)
            }
        }
    },[Manga, chapter_id])
    // console.log('index type: ', indexOFmanga)
    
    // ======================================================
    //for current image viewing tracker e.g., 1 / 30
    const [currentIndexTrack, setCurrentIndexTrack] = useState(0);
    useEffect(() => {
        if (!chapter?.images) return;
        
        const observers = [];
        
        chapter.images.forEach((_, idx) => {
            const el = document.getElementById(`snap-img-${idx}`);
            if (!el) return;
            
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setCurrentIndexTrack(idx);
                    }
                },
                {
                    threshold: 0.3,
                }
            );
            
            observer.observe(el);
            observers.push(observer);
        });
        
        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, [chapter?.images]);

    // =================================================
    const [toggleSelectionChapter, setToggleSelectionChapter] = useState(false)
    const toggleFunc = () => {
        setToggleSelectionChapter(prev => !prev)
    }
    // =================================================
    const scrollContainerRef = useRef(null)
    
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    },[indexOFmanga])
    
    // =================================================

    // useEffect(() => {
    //     if (ReaderCredentials) {
    //         try {
    //             const 
    //         } catch (error) {
    //             console.error('From frontend received an Error: ', error)
    //         }
    //     }
    // },[ReaderCredentials])

    // =================================================


    // const [Updated_User_Credentials, setUpdatedCredentials] = useState(null)
    const [heart, setHeart] = useState(false)
    // const [isHeartReady, setIsHeartReady] = useState(false);
    const [animateHeart, setAnimateHeart] = useState(false)
    const toggleHeart = () => {
        setHeart(prev => !prev);
        setAnimateHeart(true);
        setTimeout(() => setAnimateHeart(false), 200); // reset after animation
    }

    // const toggleHeart = () => {
    //     if (!ReaderCredentials || !ReaderCredentials.User_Activities_idfk || !ReaderCredentials.id || !manga_id) {
    //         console.warn('Missing ReaderCredentials or manga_id — skipping toggle');
    //         return;
    //     }

    //     const newHeartState = !heart;
    //     setHeart(newHeartState);
    //     setAnimateHeart(true);
    //     setTimeout(() => setAnimateHeart(false), 200);

    //     const url = newHeartState
    //         ? `/api/set_Liked/${ReaderCredentials.User_Activities_idfk}/${manga_id}/${ReaderCredentials.id}`
    //         : `/api/set_UnLike/${ReaderCredentials.User_Activities_idfk}/${manga_id}/${ReaderCredentials.id}`;

    //     fetch(url, { method: 'GET' })
    //         .then(res => res.json())
    //         .then(data => {
    //         console.log(newHeartState ? 'Hearted:' : 'Unhearted:', data.message);
    //         })
    //         .catch(error => {
    //         console.error('Error syncing heart:', error);
    //         });
    // };

    useEffect(() => {
        // console.log('Checking ReaderCredentials:', ReaderCredentials);
        // if (!ReaderCredentials || !ReaderCredentials.User_Activities_idfk || !manga_id) return;

        const checkLiked = async () => {
        try {
            const result = await fetch(`/api/CheckLiked/${ReaderCredentials.User_Activities_idfk}/${manga_id}`, {
            method: 'GET'
            });

            console.log('Raw fetch result:', result);

            if (!result.ok) {
                console.warn(' Fetch failed with status:', result.status);
                return;
            }

            const response = await result.json();
            console.log('Parsed response:', response);

            if (response) {
                console.log('working');
                setHeart(response.isLiked);
                setIsHeartReady(true);
            } else {
                console.log(' No response or empty response:', response);
            }
        } catch (error) {
            console.error(' Error checking liked status:', error);
        }
        };
        checkLiked();
    }, [ReaderCredentials, manga_id]);


    // useEffect(() => {
    //     const getUpdatedUserCredentials = async () => {
    //         const result = await fetch(`/api/UserUpdated_Credentials/${ReaderCredentials.id}`, {
    //             method : 'GET'
    //         })

    //         const response = await result.json();
    //         setUpdatedCredentials(response)

    //     }
    //     getUpdatedUserCredentials();
    // }, [ReaderCredentials, manga_id, heart])
    // console.log('Updated credentials: ', Updated_User_Credentials)
    
    useEffect(() => {
        if (heart === true) {
            try {
                const UserActivity_set_Heart = async () => {
                    const result = await fetch(`/api/set_Liked/${ReaderCredentials.User_Activities_idfk}/${manga_id}/${ReaderCredentials.id}`, {
                        method : 'GET'
                    })
                    
                    const response = await result.json();
                    console.log('heart Successfully', response.message)
                    setHeart(true)
                }
                UserActivity_set_Heart();
            } catch (error) {
                console.error('from frontend received an Error: ', error)
            }
        } else {
            try {
                const UserActivity_set_unheart = async () => {
                    const result = await fetch(`/api/set_UnLike/${ReaderCredentials.User_Activities_idfk}/${manga_id}/${ReaderCredentials.id}`, {
                        method : 'GET'
                    })
                    
                    const response = await result.json();
                    console.log('Unheart Successfully ',response.message)
                }
                UserActivity_set_unheart()
            } catch (error) {
                console.error('From frontend received an Error: ', error)
            }
        }

    },[heart, ReaderCredentials, manga_id])
    // ==========================================================================================================================================> End of Footer
    
    const func_returnHome = () => {
        navigateTo('/home')
    }

        return(
            <>
                <div className="w-auto h-screen relative ">
                    <div className=''>
                        <Header />
                    </div>
                    <main className='w-full h-full relative flex  '>
                        {/* <section className='bg-orange-200 h-full flex flex-col justify-center '> */}
                            <div ref={scrollContainerRef} className='h-screen w-full overflow-y-scroll flex flex-col items-center scroll-smooth snap-y snap-mandatory snap-center '>
                                {chapter.images?.length > 0 && chapter.images.map((img, idx) => (
                                    <>
                                            <img src={`http://localhost:5000${img}`} key={idx} alt="image" id={`snap-img-${idx}`} className=' snap-center h-full object-contain '/>
                                    </>
                                    )
                                )}
                            </div>
                        {/* </section> */}
                        <footer className="flex flex-col w-[300px] h-auto gap-3 items-end absolute right-10 bottom-20 text-white">
                            <div className="transition-colors duration-300 ">
                                <input type="checkbox" className="sr-only" checked={heart} onChange={toggleHeart} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill={`${heart ? 'red' : 'none'}`} viewBox="0 0 24 24" strokeWidth={heart ? 0 : 1.5} stroke={`currentColor`} 
                                    className={`cursor-pointer size-10 transition-all duration-200 ${animateHeart ? 'scale-125' : 'scale-100'}`} 
                                    onClick={toggleHeart}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg> */}
                            </div>


                            <div className='text-3xl'>
                                <span>{Manga.title}</span>
                            </div>
                            {toggleSelectionChapter && (
                                <>
                                    <div className='w-full flex flex-wrap p-2 gap-2 bg-[#2f3136] rounded'>
                                        {Manga.Chapters_idfk?.length > 0 && Manga.Chapters_idfk.map((chapters, index) => (
                                            <Link className={` ${indexOFmanga === index + 1 && 'border-amber-400'} border w-10 h-10 flex rounded items-center justify-center bg-[#222]`} key={chapters._id} to={`/Reader_ChapterSelectedView/${manga_id}/${chapters._id}`}>
                                                {index + 1}
                                            </Link>
                                        ))}
                                    </div>
                                
                                </>
                            )}
                            <div className=" bottom-10 flex flex-row items-center gap-4 text-[20px] ">
                                <span className="">
                                    {/* 1 / 30 */}
                                    {currentIndexTrack + 1} / {chapter.images?.length}
                                </span>
                                <span>of Chapter {indexOFmanga}</span>
                                <button className='cursor-pointer' onClick={func_returnHome}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                </button>
                                <button className="flex items-center border rounded cursor-pointer" onClick={toggleFunc}>
                                    <span class="material-symbols-outlined ">grid_on</span>
                                </button>
                            </div>
                        </footer>
                    </main>
                </div>
            </>
        );
}
