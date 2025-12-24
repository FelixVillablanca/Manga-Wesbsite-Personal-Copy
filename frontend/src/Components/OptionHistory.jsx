
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import HistoryManga_Card from './HistoryManga_Card';
import '../Styles/style.css'

export default function History({ userID }) {

    const [Session, setSession] = useState({})
    useEffect(() => {
        const func_getUpdated_Session = async() => {
            const result = await fetch(`/api/getUpdated_Session/${userID}`)
            
            if (!result.ok) return console.log('From History backend, received an Error a status of: ', result.status)
            const response = await result.json();

            if (response?.updated_session_token) {
                localStorage.setItem('Reader_Credentials', response?.updated_session_token)
                const getTokenUpdated = localStorage.getItem('Reader_Credentials');
                if (getTokenUpdated) {
                    const decoded_updated_token = jwtDecode(getTokenUpdated)
                    setSession(decoded_updated_token)
                }
            }

        }
        func_getUpdated_Session();
    },[userID])
    console.log('From History Session: ', Session)

    const [chapter_first_image, setChapter_First_Image] = useState([])
    const reversedImages = chapter_first_image.slice().reverse();
    useEffect(() => {
        if (Array.isArray(Session.Recent_Viewed)) {
            Session.Recent_Viewed.map(manga => {
                if (Array.isArray(manga.Chapters_idfk)) {
                    // manga.Chapters_idfk.map(chapters => {
                        if (manga.Chapters_idfk[0]) {
                            fetch(`/api/get_User_Recent_Viewed_Manga_and_get_Chapter_first_image/${manga.Chapters_idfk?.[0]}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data) {
                                    if (data) {
                                        setChapter_First_Image(prev => [...prev, data])
                                    } else {
                                        console.log(data.message)
                                    }
                                }
                            })
                        }
                    // })
                }
            })
        }
    },[Session])

    console.log('chapter_first_image: ', chapter_first_image)
    // console.log('chapter_first_image: ', chapter_first_image?.[0]?.images?.[0])

    return(
        <>
            <main className='w-full h-full  flex flex-col bg-white p-5 select-none'>
                <div className='border-b text-2xl pb-2 '>
                    Recent Viewed Manga
                </div>
                <div className='pt-4 flex flex-col items-center justify-center'>
                    <div>
                        <span className='font-medium'>{Session?.Recent_Viewed?.length}</span> Manga
                    </div>
                    <div className='overflow-auto max-h-[430px] w-full scrollbar-hide Link-card'>
                        {Array.isArray(Session?.Recent_Viewed) && Session.Recent_Viewed.slice().reverse().map((Recent_viewed_manga, index) => (
                            <HistoryManga_Card 
                                manga_id={Recent_viewed_manga._id}
                                image={reversedImages?.[index]?.images?.[0]}
                                title={Recent_viewed_manga.title}
                                Genre={Recent_viewed_manga.Genre}
                                Chapters={Recent_viewed_manga.Chapters_idfk.length}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}