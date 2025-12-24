import { useRef, useEffect, useState,  } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

import '../Styles/style.css'
import Header from '../Components/Header';


export default function Reader_ViewManga() {
    const { id } = useParams();
    const navigateTo = useNavigate();

    // =====================================================================================
    //USER SESSION
    // const [UserCredentials, setUserCredentials] = useState(null);
    // useEffect(() => {
    //     const getLocalStorage = localStorage.getItem('userCredentials')
        
    //     if (getLocalStorage) {
    //         const decoded_data = jwtDecode(getLocalStorage);
    //         setUserCredentials(decoded_data)
    //     } else {
    //         navigateTo('/')
    //     }
        
    // })
        const [UserCredentials, setUserCredentials] = useState(null)
        useEffect(() => {
            const token = localStorage.getItem('Reader_Credentials'); // gettin user info and the Token
            
            if (token) {
                //it gets the { id: checkUser._id, username: checkUser.username, email: checkUser.email }
                const userCredentials = jwtDecode(token) //decoding, to access the user info inside of this jsonwebtoken -  jwt.sign({}) 
                setUserCredentials(userCredentials)
            } else {
                navigateTo('/')
            }
        },[])


    
    // const handleLogout = () => {
    //     localStorage.removeItem('Reader_Credentials')
    //     setUserCredentials(null)
    //     navigateTo('/')
    //     // window.location.reload()
    // }
    // =====================================================================================


    // =====================================================================================
    // AUTOFETCH THE MANGA
    const [filteredManga, setFilteredManga] = useState([])
    const notYet = false;
    useEffect(() => {
        const mangaFetched = async () => {
            try {
                const result = await fetch(`/api/get_manga/${id}/${UserCredentials.id}/${notYet}`, {
                    method : 'GET'
                })
                const response = await result.json();

                if (response) {
                    setFilteredManga(response)
                }
                
            } catch (error) {
                console.error('From frontend catched error: ', error)
            }

            
        }
        mangaFetched()
    },[id, UserCredentials])

    // console.log('fetched manga: ', filteredManga)
    // console.log('fetched manga id: ', filteredManga.Chapters_idfk?.[0]._id)
    // =====================================================================================
    const [currentPage, setCurrentpage] = useState(1)
    const LimitManga = 6;

    const indexOf_LastManga = currentPage * LimitManga;
    const indexOf_FirstManga = indexOf_LastManga - LimitManga;
    const filteredLimited = filteredManga.Chapters_idfk?.slice(indexOf_FirstManga, indexOf_LastManga);
    const totalPages = Math.ceil(filteredManga.Chapters_idfk?.length / LimitManga )


    // console.log('filtered', filteredLimited)
    // console.log('user credentials', UserCredentials.id)


        return(
            <>
                <div className='relative w-full h-screen '>
                    <div>
                        <Header />
                    </div>
                    <div className='flex items-center justify-center h-[93%]'>
                        <div className=' flex w-[70%] h-[620px]'>
                            <div className='relative w-[50%]'>
                                <img src={`http://localhost:5000${filteredManga.Chapters_idfk?.[0].images?.[0]}`} alt={filteredManga.title} className='w-full h-full'/>
                            </div>
                            <div className='bg-[#222] w-full h-full relative  rounded '>
                                <div className='w-full p-5 flex flex-col justify-center bg-[#333]'>
                                    <div>
                                        <span className='text-amber-400 text-4xl font-extrabold'>{filteredManga.title}</span>
                                    </div>
                                    <div>
                                        <span className='text-white pl-1 text-[20px]'>Chapters</span>
                                    </div>
                                </div>
                                <div className='flex flex-col w-full h-129 p-4 gap-1 relative'>
                                    {filteredLimited?.length > 0 &&
                                    filteredLimited.map((chapter, index) => (
                                        <Link to={`/Reader_ChapterSelectedView/${filteredManga._id}/${chapter._id}`} className='card-chapters '>
                                            <div key={chapter._id || index} className="w-full bg-white p-2 flex gap-3 items-center rounded hover:bg-gray-200">
                                                <div>
                                                    <img src={`http://localhost:5000${chapter.images?.[0]}`} alt={`Chapter ${index + 1}`}
                                                        className="w-10 h-13 rounded"
                                                    />
                                                </div>
                                                <span className=" text-black  text-[19px]">Chapter {indexOf_FirstManga + index + 1}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className='h-[12%] flex items-center justify-center '>
                                    <div className='flex items-center border rounded gap-4 bg-gray-900'>
                                        <button 
                                            className={`cursor-pointers border rounded-bl rounded-tl w-25 p-2 ${currentPage === 1? 'bg-black text-gray-600 border border-gray-600' : 'bg-black text-white'}`}
                                            onClick={() => setCurrentpage(page => Math.max(page - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                        <span className="text-white">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button 
                                            className={`cursor-pointers border rounded-br rounded-tr w-25 p-2 ${currentPage === totalPages ? 'bg-black text-gray-600 border border-gray-600' : 'bg-black text-white'}`}
                                            onClick={() => setCurrentpage(page => Math.min(page + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                                <div className='w-35 transform translate-y-[-350%] translate-x-[10%] text-white bg-amber-400 rounded '>
                                    <Link className=' flex p-2 items-center w-full rounded gap-2 relative cursor-pointer hover:bg-amber-500' to={`/Reader_ChapterSelectedView/${id}/${filteredManga.Chapters_idfk?.[0]._id}`}>
                                        <span className='text-[5px] pl-1'>Chapter </span><span className='pl-.5'>1</span>
                                        <span class="material-symbols-outlined text-[15px]  absolute right-0">chevron_right</span>
                                    </Link>
                                </div>
                            </div>


                        </div>
                        {/* manga {id}   */}
                    </div>
                </div>
            </>
        );
}
