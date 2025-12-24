
import '../Styles/style.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef} from 'react';
import UserDefault from '../assets/User-default-image.jpg'
import { jwtDecode } from 'jwt-decode';
export default function Header() {
        const navigateTo = useNavigate()    

        const [Reader_Session, setReader_Session] = useState(null)
        useEffect(() => {
            const Reader_Session_Token = localStorage.getItem('Reader_Credentials');
            if (Reader_Session_Token) {
                const decoded_session = jwtDecode(Reader_Session_Token);
                setReader_Session(decoded_session)
            }
        },[])

        const handleLogout = () => {
            localStorage.removeItem('Reader_Credentials')
            setReader_Session(null)
            navigateTo('/')
        }

        const [searchBar, setSearchBar] = useState(false)

        const [toggleOptions, setToggleOptions] = useState(false)
        const ReaderToggleOptions = () => {
            setToggleOptions(prev => !prev)
        }
    
    // const optionRef = useRef(null)
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (optionRef.current && !optionRef.current.contains(event.target)) {
    //             setToggleOptions(false)
    //         }
    //     }
        
    //     if (toggleOptions) {
    //         document.addEventListener('mousedown', handleClickOutside);
    //         // setToggleOptions(false)
    //     }

    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside)
    //     }
    // },[toggleOptions])

        const profileImgRef = useRef(null)
        
        const searchRef = useRef(null)
        useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                if (entry.target === profileImgRef.current && toggleOptions) {
                    setToggleOptions(false);
                }
                if (entry.target === searchRef.current && searchBar) {
                    setSearchBar(false);
                }
                }
            });
            },
            {
                root: null,
                threshold: 0.1,
            }
        );

        if (profileImgRef.current) observer.observe(profileImgRef.current);
        if (searchRef.current) observer.observe(searchRef.current);

        return () => {
            if (profileImgRef.current) observer.unobserve(profileImgRef.current);
            if (searchRef.current) observer.unobserve(searchRef.current);
        };
        }, [toggleOptions, searchBar]);



//======================================================
    const inputRef = useRef(null)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    },[searchBar])

    const [mangas, setMangas] = useState([])
    useEffect(() => {
        const all_manga = async () => {
            try {
                const result = await fetch('/api/get_Mangas', {
                    method : 'GET'
                })
                
                const response = await result.json();
                if (response) {
                    setMangas(response)
                }
            } catch (error) {
                console.error('From frontend received an Error: ', error)
            }
        }
        all_manga();
    },[])
    // console.log('mangas: ', mangas)
    
    const [typedListener, setTypeListener] = useState("")
    const [search_filtered, setSearch_Filtered] = useState([]);
    const searchListener = (e) => {
        setTypeListener(e.target.value)
    }
    useEffect(() => {
        const query = typedListener.trim().toLowerCase();
        if (query.length === 0) {
            setSearch_Filtered([])
        } else {
            const filtered_Search = mangas.filter(manga => manga.title.toLowerCase().includes(query));
            setSearch_Filtered(filtered_Search)
        }
    },[typedListener])

    useEffect(() => {
        if (Reader_Session) {
            console.log('Reader_Session: ', Reader_Session)
        }
    },[Reader_Session])

    //Category
    const Profile = "Profile"
    const Liked = "Liked"
    const History = "History"

    return(
        <>
            <header ref={searchRef} className=' flex relative w-auto h-[60px] items-center justify-center bg-transparent'>
                <Link className=' absolute left-5' to="/home">
                    <h1 className='font-bold text-[30px] text-white '>Manga<span className="text-amber-300 ">Verse</span></h1>
                </Link>

                <div className={`flex items-center justify-center absolute transition-all duration-200 ${searchBar ? 'right-175 hidden' : 'right-20'}  overflow-hidden`} onClick={() =>setSearchBar(true)}>
                    <input type="search" placeholder='search' className={`border ${searchBar ? 'w-130': 'w-full'} p-2 pl-8 rounded-[20px] bg-white focus:outline-none`}/>
                    <button className='flex items-center justify-center absolute left-2 cursor-pointer'>
                        <span class="material-symbols-outlined text-black">search</span>
                    </button>
                </div>
                <div ref={profileImgRef} className=' absolute right-5 cursor-pointer' onClick={ReaderToggleOptions}>
                    <img src={Reader_Session?.image ? `http://localhost:5000${Reader_Session?.image}` : UserDefault} alt="" className='w-10 h-10 rounded-full'/>
                </div>
                {toggleOptions && (
                    <div  className='bg-white fixed h-auto top-15 right-0 z-50 p-5 flex flex-col w-[13%] gap-1 rounded'> {/*ref={optionRef}*/} 
                        <Link className='w-full relative' to={`/Reader_options/${Profile}`}>
                            Profile
                        </Link>
                        <Link to={`/Reader_options/${Liked}`}>
                            Liked
                        </Link>
                        <Link to={`/Reader_options/${History}`}>
                            History
                        </Link>
                        <button onClick={handleLogout} className='group cursor-pointer flex gap-1 justify-center items-center'>
                            <span>Logout</span>
                            <span class="material-symbols-outlined group-hover:text-red-600">logout</span>
                        </button>
                    </div>
                )}
                <div className={`w-[50%] top-20 fixed flex justify-center flex-col bg-white transition-all duration-200 ${searchBar ? 'translate-x-[0%] opacity-100':'translate-x-[5%] opacity-0 pointer-events-none'} z-10 p-10 rounded overflow-hidden shadow-2xl`}>
                    <button className=" absolute flex items-center justify-center top-2 right-2 cursor-pointer" onClick={() => setSearchBar(false)}>
                        <span class="material-symbols-outlined flex items-center justify-center">close</span>
                    </button>
                    <div  className={`flex relative w-full items-center transition-all duration-400 ${searchBar ? 'translate-x-0 opacity-100' :'translate-x-40 opacity-0'}`} >
                        <input ref={inputRef} type="text" placeholder="Search" className="p-2 w-full border rounded-[20px] pl-9" onChange={searchListener}/>
                        <button className='flex items-center justify-center absolute left-2 cursor-pointer '>
                            <span class="material-symbols-outlined text-black">search</span>
                        </button>
                    </div>
                    <div>
                        {typedListener.trim().length > 0 &&(
                            <div>
                                You've searched for "{typedListener}"
                            </div>
                        )}
                        {/* {typedListener.trim().length === 0 &&(
                            <div className="transition-all duration-300">
                                recent searches
                            </div>
                        )} */}
                        
                    </div>
                    <div className="flex flex-col gap-1">
                        {search_filtered.length > 0 && search_filtered.map((manga, index) => (
                            <Link key={manga._id} className="border flex p-1 gap-1 rounded hover:bg-gray-200" to={`/Reader_manga_view/${manga._id}`} onClick={() => setSearchBar(false)}>
                                <div className="">
                                    <img 
                                        src={`http://localhost:5000${manga.Chapters_idfk?.[0].images?.[0]}`} 
                                        alt={manga.title} 
                                        className="w-10"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {manga.title}
                                    </span>
                                    <span className="text-[10px]">
                                        {JSON.parse(manga.Genre).join(", ")}
                                    </span>
                                </div>
                            </Link>
                            )
                        )}
                    </div>
                    <div>
                        recommendation
                    </div>
                </div>
            </header>
        </>
    );
}