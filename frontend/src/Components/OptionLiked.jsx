import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import '../Styles/style.css'

import mangaExample from '../assets/solo-leveling-vol-02-gn-manga.webp'
import { jwtDecode } from 'jwt-decode';

import LikedManga from './LikedManga';
export default function Liked ({ userID }) {

    const [Session, setSession] = useState({})
    // const imageReverse = Session?.Liked.slice().reverse()
    useEffect(() => {
        const getUpdated_Session = async () => {
            const result = await fetch(`/api/getUpdated_Session/${userID}`);

            const response = await result.json();

            if (!response) return console.log('From frontend fetch updated user session status: ', response.message);

            if (response?.updated_session_token) {
                // console.log('Updated Session_token: ', response.updated_session_token)
                localStorage.setItem('Reader_Credentials', response.updated_session_token); //updating the token inside the localStorage
                const updated_session = localStorage.getItem('Reader_Credentials'); //getting the updated token
                const decode_token = jwtDecode(updated_session); //decoded token, so i can access the data inside stored of that token
                setSession(decode_token) // parsing the json or the data from the backend like jwt.sign({ id, username, email, role, image})
            }
            
            console.log('No Updated session token from the fetch')
        }
        getUpdated_Session();
    },[userID])
    
    // useEffect(() => {
    //     console.log('check user id from updated token: ', Session)
    // },[Session]) //continue

    // console.log('User id: ', userID)

    // const [Liked, setLiked] = useState([])
    // useEffect(() => {
    //     const func_getLiked = async () => {
    //         const result = await fetch(`/api/getLiked/${}`)
    //     }
    //     func_getLiked();
    // },[])

    const [UserLiked, setUserLiked] = useState([]) // Chapters[0] contains
    console.log('Session liked outside: ', Session.Liked)
    const userLiked_Reverse = UserLiked?.slice().reverse();
    useEffect(() => {
        if (Array.isArray(Session.Liked)) {
            Session.Liked.map(like => {
                if (Array.isArray(like.Chapters_idfk)) {
    
                    // like.Chapters_idfk.map(manga => {
                        fetch(`/api/UserGetLikedManga/${like.Chapters_idfk?.[0]}`)
                        .then(response => response.json())
                        .then(data => {
                                setUserLiked(prev => [...prev, data])
                        })
                    // })
                }
                console.log('session like: ', like.Chapters_idfk)
            })
    
        }

    },[Session.Liked])
    // console.log('User Liked : ', UserLiked)
    
    // console.log('session : ', Session)
    // console.log('user img: ', UserLiked?.[0])
    // console.log('user img : ', UserLiked?.[0]?.images?.[0])
    return(
        <>
            <main className='w-full h-full  flex flex-col bg-white p-5 select-none'>
                <div className='border-b text-2xl pb-2 '>
                    Recent Liked Manga
                </div>
                <div>
                    <div className='pt-4'>
                            <div>
                                <span className='font-medium'>{Session?.Liked?.length}</span> Manga
                            </div>
                            <div className='border overflow-auto max-h-[430px] scrollbar-hide Link-card'>
                                {Array.isArray(Session.Liked) && Session?.Liked.slice().reverse().map((Likes, index) => (
                                            <LikedManga key={index}
                                                manga_id={Likes._id}
                                                image={userLiked_Reverse?.[index]?.images?.[0]}
                                                title={Likes.title}
                                                Genre={Likes.Genre}
                                                Chapters={Likes.Chapters_idfk?.length}
                                            />
                                ))}
                            </div>
                    </div>
                </div>
            </main>
        </>
    );
}