
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/style.css'
import Slider from "react-slick";
import static_pic from '../assets/solo-leveling-vol-02-gn-manga.webp'


export default function TopTen() {

        const settings = {
            className: "center",
            centerMode: true,
            infinite: true,
            centerPadding: "0px",
            slidesToShow: 3,
            speed: 500,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true
        };

        const [TopTen_Most_View, setTopTen_Most_View] = useState([]);
        const [isTopTen_Exist, setIsTopTen_Exist] = useState(null)
        useEffect(() => {
            const func_TopTen = async () => {
                const result = await fetch('/api/TopTen_MostView', {
                    method: 'GET'
                })
    
                if (!result.ok) return console.log("RAW fetch result throw a Status of : ", result.status)
                const response = await result.json();
    
                if (response.StatusOk) {
                    setTopTen_Most_View(response.TopViewedManga)
                    setIsTopTen_Exist(response.StatusOk) // True
                } else {
                    setIsTopTen_Exist(response.StatusOk) // false
                }
            }
            func_TopTen();
        },[])
    
        // if (Array.isArray(TopTen_Most_View) && TopTen_Most_View.length > 0) {
        //     TopTen_Most_View.map((manga, index) => {
        //         console.log('Top Ten Most View: ', manga, 'Index: ', index )
        //     })
        // }
        
        
        const [TopTEN_Manga_Likes, setTopTEN_Manga_Likes] = useState([])
        useEffect(() => {
            const func_TopTEN_Manga_Likes = async () => {
                const result = await fetch('/api/TopTEN_MostLikes_Manga', {
                    method : 'GET'
                })
                
                const response = await result.json();
                
                if (response) {
                    setTopTEN_Manga_Likes(response)
                }
            }   
            func_TopTEN_Manga_Likes();
        },[])
        // if (Array.isArray(TopTEN_Manga_Likes) && TopTEN_Manga_Likes.length > 0) {
        //     TopTen_Most_View.map((manga, index) => {
        //         console.log('Top Ten Most View: ', manga, 'Index: ', index )
        //     })
        // }
        console.log('TopTen Manga Likes: ', TopTEN_Manga_Likes)
        
        // const TruncatedTitle = TopTEN_Manga_Likes
        const maxLetter = 19;
        const truncate = (title) => {
            const truncated = title.length > maxLetter ? title.slice(0, maxLetter) + ". . ." : title;
            return truncated
        }


    return(
        <>
            <div id='sidebar' className='sticky top-15 h-[120%]'>
                {/* Top 5 Most Views Section */}
                <div className='w-full h-[50%] relative mb-4'>
                    {/* Section Header */}
                    <div className='bg-gradient-to-r from-amber-400 to-amber-500 p-2 flex items-center gap-2 rounded-t-lg shadow-md'>
                        <span className="material-symbols-outlined text-black text-lg">trending_up</span>
                        <h1 className='text-base text-black font-bold'>Top 5 Most Views</h1>
                    </div>
                    
                    {/* Slider Container */}
                    <div className='relative w-full h-full bg-[#2a2a2a] rounded-b-lg overflow-hidden'>
                        {isTopTen_Exist && (
                            <div className="slider-container-Top-Ten">
                                <Slider {...settings} className='overflow-visible w-full max-w-6xl mx-auto'>
                                    { Array.isArray(TopTen_Most_View) && TopTen_Most_View.length > 0 && TopTen_Most_View.map((Top, index) => (
                                        <Link key={Top._id} to={`/Reader_manga_view/${Top._id}`}>
                                            <div className="container-manga-top-ten translate-y-3 relative w-full px-3">
                                                {/* Manga Image Container */}
                                                <div className='relative w-full h-full overflow-visible rounded-lg'>
                                                    <img 
                                                        src={`http://localhost:5000${Top.Chapters?.[0].images?.[0]}`} 
                                                        alt="" 
                                                        className="w-full h-full object-cover rounded-lg" 
                                                    />
                                                    {/* Gradient Overlay for better text readability */}
                                                    <div className='absolute inset-0 bg-gradient-to-t  to-transparent rounded-lg'></div>
                                                    
                                                    {/* Rank Badge - Positioned on left side, overlapping the image */}
                                                    <div className='absolute top-17 left-[-16px] z-30'>
                                                        <span className='text-black text-[50px] font-extrabold leading-none block' 
                                                            style={{ 
                                                                WebkitTextStroke: '2px gold', 
                                                                textShadow: '3px 3px 8px rgba(0,0,0,1), 0 0 10px rgba(255,215,0,0.5)',
                                                                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'
                                                            }} 
                                                        >
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Views Badge - Positioned at bottom right corner, extra small size */}
                                                    <div className='absolute bottom-19 right-[-1px] bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-full px-1 py-0.5 flex items-center justify-center gap-0.5 shadow-md border border-amber-300/70 z-30'>
                                                        <span className="material-symbols-outlined text-[8px] leading-none ">visibility</span>
                                                        <span className='font-bold text-[8px] leading-none whitespace-nowrap'>{1000 + Top.interactionCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </Slider>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Top 10 Most Likes Section */}
                <div className='h-[50%] w-full relative overflow-auto flex flex-col gap-2 scrollbar-hide bg-[#2a2a2a] rounded-lg'>
                    {/* Section Header */}
                    <div className='bg-gradient-to-r from-amber-400 to-amber-500 p-3 flex items-center gap-2 sticky top-0 z-20 rounded-t-lg shadow-md'>
                        <span className="material-symbols-outlined text-black text-xl">favorite</span>
                        <h1 className='text-lg text-black font-bold'>Top 10 Most Likes</h1>
                    </div>
                    
                    {/* Likes List */}
                    <div className='p-2 space-y-2'>
                        {Array.isArray(TopTEN_Manga_Likes) && TopTEN_Manga_Likes.length > 0 && TopTEN_Manga_Likes.map((TopTen, index) => (
                            <Link key={TopTen._id} to={`/Reader_manga_view/${TopTen._id}`} className='card-chapters block'>
                                <div className='flex rounded-lg bg-[#1a1a1a] p-2 hover:bg-[#2a2a2a] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-gray-700/50 hover:border-amber-400/50'>
                                    {/* Rank Number */}
                                    <div className='flex items-center justify-center min-w-[50px] bg-gradient-to-br from-black to-gray-900 rounded-lg border-2 border-amber-400/60 shadow-lg'>
                                        <span className='text-white font-extrabold text-2xl'
                                            style={{ WebkitTextStroke: '2px gold', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                            {index + 1}
                                        </span>
                                    </div>
                                    
                                    {/* Manga Image */}
                                    <div className='ml-2 flex-shrink-0'>
                                        <img 
                                            src={`http://localhost:5000${TopTen?.Chapters?.[0].images?.[0]}`} 
                                            alt={truncate(TopTen.title)} 
                                            className='w-16 h-20 object-cover rounded border border-gray-600' 
                                        />
                                    </div>
                                    
                                    {/* Manga Info */}
                                    <div className='flex flex-col justify-between flex-1 p-2 min-w-0'>
                                        {/* Title */}
                                        <span className='text-white font-semibold text-sm mb-2 truncate hover:text-amber-400 transition-colors duration-200'>
                                            {truncate(TopTen.title)}
                                        </span>
                                        
                                        {/* Stats */}
                                        <div className='flex flex-col gap-1.5'>
                                            {/* Likes Count */}
                                            <div className='flex items-center gap-1.5'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={0} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                </svg>
                                                <span className='text-red-400 text-xs font-medium'>
                                                    {500 + TopTen.NumberReaderLiked}
                                                </span>
                                            </div>
                                            
                                            {/* Views Count */}
                                            <div className='flex items-center gap-1.5'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                                <span className='text-orange-400 text-xs font-medium'>
                                                    {1000 + TopTen.interactionCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}