import '../Styles/style.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState, useCallback, useRef } from 'react';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import contentStatic_picture from '../assets/solo-leveling-vol-02-gn-manga.webp'

//Import Component
import Cards from './Cards';

//For slider
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


// const dataCarousel = [
//     {
//         img : contentStatic_picture
//     },
//     {
//         img : contentStatic_picture
//     },
//     {
//         img : contentStatic_picture
//     },
//     {
//         img : contentStatic_picture
//     },
//     {
//         img : contentStatic_picture
//     },
//     {
//         img : contentStatic_picture
//     },
//     {
//         img : contentStatic_picture
//     }
// ] 

export default function Contents() {
// =============================================================================================

// =============================================================================================
//AUTO FETCH MANGA's

    // const [manga, setManga] = useState([])
    // const [getGenre, setGenre] = useState([])
    const [filteredManga, setFilteredManga] = useState([])
    useEffect(() => {
        const fetch_all_manga = async () => {
                
            try {
                const response = await fetch (`/api/get_Mangas`, {
                    method : 'GET'
                })
                const result = await response.json();

                if (!result) return console.log('Frontend received error response from backend: ', result.message)
                    
                        const publishedManga = result.filter(manga => manga.Published?.trim().toLowerCase() === "published");
                        setFilteredManga(publishedManga) //.populate('Chapters_idfk)
                        // setGenre(JSON.parse(result.Genre))
                    
            } catch (error) {
                console.error('From frontend error: ', error)
            }
                
        }
        fetch_all_manga() 
    },[])
    // console.log('manga fetched genre: ', getGenre)
    // console.log('manga fetched: ', filteredManga)
    // console.log(manga[0].Chapters_idfk[0].images[0])
// =============================================================================================


// =============================================================================================
//PAGINATION
    const [currentPage, setCurrentpage] = useState(1)
    const LimitManga = 12;

    
    const indexOf_LastManga = currentPage * LimitManga;
    const indexOf_FirstManga = indexOf_LastManga - LimitManga;
    const filteredLimited = filteredManga.slice(indexOf_FirstManga, indexOf_LastManga);
    const totalPages = Math.ceil(filteredManga.length / LimitManga )



// =============================================================================================


// =============================================================================================
// CARD
// TRUNCATED WORD

const truncated_Title= (letters) => {
    const title = letters; // Solo Leveling
    const maxLetter = 15;
    
    const truncatedWord = title.length > maxLetter ? title.slice(0, maxLetter) + " . . . " : title;
    return truncatedWord
}

const truncated_hover_card = (letters) => {

    const hoverINFO_Title = letters; // Solo Leveling
    const maxLetter_hoverINFO = 50;
    const truncated_Title_Hover_info = hoverINFO_Title.length > maxLetter_hoverINFO ? hoverINFO_Title.slice(0, maxLetter_hoverINFO) + ". . ." : hoverINFO_Title;     
    return truncated_Title_Hover_info
}
// =============================================================================================
    const [latest_Chapters, setLatest_Chapters] = useState([])
    useEffect(() => {
        const func = async () => {
            const result = await fetch('/api/get_latest_chapters', {
                method : 'GET'
            })

            if (!result.ok) {
                console.log("RAW fetch result Throw an Error, a status of ", result.status)
            }

            const response = await result.json()
            if (response) {
                setLatest_Chapters(response)
            } else {
                console.log("Error response: ", response.message)
            }
        }
        func();
    },[])

    console.log('latest_Chapters: ', latest_Chapters)



// =============================================================================================
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,

    autoplay : true,
    autoplaySpeed : 10000,
    pauseOnHover : true,

    swipe: true,
    draggable: true,

    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,

            autoplay : true,
            autoplaySpeed : 10000,
            pauseOnHover : true,

            // swipe: true,
            // draggable: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,

            autoplay : true,
            autoplaySpeed : 10000,
            pauseOnHover : true,

            // swipe: true,
            // draggable: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1,

            autoplay : true,
            autoplaySpeed : 10000,
            pauseOnHover : true,

            // swipe: true,
            // draggable: true,
        }
      }
    ]
  };

    return(
        <>
                    <div className=' relative bg-[#333] rounded flex flex-col w-full'>
                        <div className=' bg-gradient-to-r from-amber-400 to-amber-500 p-2 text-[20px] rounded text-black '>
                            Latest Chapters
                        </div>
                        <div className="slider-container p-3 w-full max-w-7xl mx-auto ">
                            <Slider {...settings} className=' max-w-full'>
                                {Array.isArray(latest_Chapters) ? latest_Chapters.map( (chap, index) => (
                                    // <div key={index} className=''>
                                    <Link key={chap._id} to={`/Reader_manga_view/${chap._id}`} className='Link-card'>
                                        <Cards 
                                            Manga_ID={chap._id}
                                            Chapters={chap.Chapters_idfk}
                                            truncatedWord={truncated_Title(chap.title)}
                                            truncated_Title_Hover_info={truncated_hover_card(chap.title)}
                                            genreMain={JSON.parse(chap.Genre)}
                                            chapterslength={chap.Chapters_idfk?.length}
                                            imgPATH={chap.Chapters_idfk?.[0].images?.[0]}
                                            Publisher={chap.Author}
                                        
                                        />
                                        </Link> 
                                    // </div>

                                )) : (
                                    <>
                                        <p>{latest_Chapters.message}</p>
                                    </>
                                )}
                            </Slider>
                        </div>
                    </div>
                    <br />
                    <div className=' bg-gradient-to-r from-amber-400 to-amber-500 p-2 text-[20px] rounded text-black '>
                        Manga
                    </div>
                    <div className='flex flex-col p-3 items-center justify-center bg-[#333]'>
                        {filteredManga.length > 0 ? (
                            <>
                                <div className='p-5 flex flex-wrap gap-3 justify-center items-center  ' >
                                    {filteredLimited.length > 0 && filteredLimited.map((attr, index)=> (
                                        // return();
                                            <Link key={attr._id} to={`/Reader_manga_view/${attr._id}`} className='Link-card'>
                                                <Cards 
                                                    Manga_ID={attr._id}
                                                    Chapters={attr.Chapters_idfk}
                                                    truncatedWord={truncated_Title(attr.title)}
                                                    truncated_Title_Hover_info={truncated_hover_card(attr.title)}
                                                    genreMain={JSON.parse(attr.Genre)}
                                                    chapterslength={attr.Chapters_idfk?.length}
                                                    imgPATH={attr.Chapters_idfk?.[0].images?.[0]}
                                                    Publisher={attr.Author}
                                                />
                                            </Link> 
                                        )  
                                    )}
                                </div>
                                <div className='h-[12%] flex items-center justify-center '>
                                    <div className='flex items-center border rounded gap-4 bg-gray-900'>
                                        <button 
                                            className={`cursor-pointer border rounded-bl rounded-tl w-25 p-2 ${currentPage === 1? 'bg-black text-gray-600 border border-gray-600' : 'bg-black text-white'}`}
                                            onClick={() => setCurrentpage(page => Math.max(page - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                        <span className="text-white">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button 
                                            className={`cursor-pointer border rounded-br rounded-tr w-25 p-2 ${currentPage === totalPages ? 'bg-black text-gray-600 border border-gray-600' : 'bg-black text-white'}`}
                                            onClick={() => setCurrentpage(page => Math.min(page + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                            <span>No Manga</span>
                            </>
                        )}

                    </div>
        </>
    );
}
