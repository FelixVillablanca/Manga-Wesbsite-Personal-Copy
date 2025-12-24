import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/style.css'

import static_pic from '../assets/solo-leveling-vol-02-gn-manga.webp'

import Header from '../Components/Header';
import Carousel from '../Components/Carousel'
import Contents from '../Components/Contents'
import TopTen from '../Components/TopTen';
// import Search from '../Components/Search';
// import Slider from "react-slick";

export default function Home() {
//   const settings = {
//     className: "center",
//     centerMode: true,
//     infinite: true,
//     centerPadding: "0px",
//     slidesToShow: 3,
//     speed: 500,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     pauseOnHover: true
//   };
    
    // const [searchBar, setSearchBar] = useState(false)

    const navigate = useNavigate();


    const [userINFO, setUserINFO] = useState(null)
    useEffect(() => {
        const token = localStorage.getItem('Reader_Credentials'); // gettin user info and the Token
        
        if (token) {
            //it gets the { id: checkUser._id, username: checkUser.username, email: checkUser.email }
            const userCredentials = jwtDecode(token) //decoding, to access the user info inside of this jsonwebtoken -  jwt.sign({}) 
            setUserINFO(userCredentials)
        } else {
            navigate('/')
        }
    },[])

    // const handleLogout = () => {
    //     localStorage.removeItem("Reader_Credentials");
    //     setUserINFO(null)
    //     navigate('/')
        
    // }

    // const [TopTen_Most_View, setTopTen_Most_View] = useState([]);
    // const [isTopTen_Exist, setIsTopTen_Exist] = useState(null)
    // useEffect(() => {
    //     const func_TopTen = async () => {
    //         const result = await fetch('/api/TopTen_MostView', {
    //             method: 'GET'
    //         })

    //         if (!result.ok) return console.log("RAW fetch result throw a Status of : ", result.status)
    //         const response = await result.json();

    //         if (response.StatusOk) {
    //             setTopTen_Most_View(response.TopViewedManga)
    //             setIsTopTen_Exist(response.StatusOk) // True
    //         } else {
    //             setIsTopTen_Exist(response.StatusOk) // false
    //         }
    //     }
    //     func_TopTen();
    // },[])

    // // if (Array.isArray(TopTen_Most_View) && TopTen_Most_View.length > 0) {
    // //     TopTen_Most_View.map((manga, index) => {
    // //         console.log('Top Ten Most View: ', manga, 'Index: ', index )
    // //     })
    // // }
    
    
    // const [TopTEN_Manga_Likes, setTopTEN_Manga_Likes] = useState([])
    // useEffect(() => {
    //     const func_TopTEN_Manga_Likes = async () => {
    //         const result = await fetch('/api/TopTEN_MostLikes_Manga', {
    //             method : 'GET'
    //         })
            
    //         const response = await result.json();
            
    //         if (response) {
    //             setTopTEN_Manga_Likes(response)
    //         }
    //     }   
    //     func_TopTEN_Manga_Likes();
    // },[])
    // // if (Array.isArray(TopTEN_Manga_Likes) && TopTEN_Manga_Likes.length > 0) {
    // //     TopTen_Most_View.map((manga, index) => {
    // //         console.log('Top Ten Most View: ', manga, 'Index: ', index )
    // //     })
    // // }
    // console.log('TopTen Manga Likes: ', TopTEN_Manga_Likes)
    
    // // const TruncatedTitle = TopTEN_Manga_Likes
    // const maxLetter = 19;
    // const truncate = (title) => {
    //     const truncated = title.length > maxLetter ? title.slice(0, maxLetter) + ". . ." : title;
    //     return truncated
    // }
    
    
    return(
        <>
                {/* {userINFO && (<h1>Example using the data from jwt,  user: {userINFO.username} </h1>) } */}
                {userINFO && (
                        <>
                            <div className='relative w-full h-auto '>
                                <div>
                                    <Header />
                                </div>
                                {/* <div className={`absolute w-[50%] translate-x-[50%] bg-transparent ${searchBar === false && 'pointer-events-none'} transition-all duration-300 z-10 overflow-hidden`}>
                                    <Search searchBar={searchBar} setSearchBar={setSearchBar}/>
                                </div> */}
                                <div id='mainContainer'>
                                    <header id='header' className=''>
                                        <Carousel />
                                    </header>
                                    <div id='contents' className=' relative '>
                                        <Contents />
                                    </div>
                                    <aside className='w-full'>
                                        <TopTen />
                                    </aside>
                                </div>
                            </div>
                        </>
                    )
                }
        </>
    );
}