import '../Styles/style.css'
import { Link } from 'react-router-dom'

//set Up Slider
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";




const dataCarousel = [
    {
        img : '/Carousel/Best-Shonen-Mangas-Recommendations.jpg'
    },
    {
        img : '/Carousel/C20241210.webp'
    },
    {
        img : '/Carousel/collage-maker-24-apr-2023-07-44-am-7772.jpg'
    },
    {
        img : '/Carousel/3307142.jpg'
    },
    {
        img : '/Carousel/underrated-shounen-manga.avif'
    },
    {
        img : '/Carousel/C20241210.webp'
    },
    {
        img : '/Carousel/Best-Shonen-Mangas-Recommendations.jpg'
    }
]

export default function Carousel() {

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: true,
        autoplaySpeed: 3000,
        initialSlide: 0,
        responsive: [
        {
            breakpoint: 1024,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
            slidesToShow: 1,
            slidesToScroll: 1
            }
        }
        ]
    };

    return(
        <>
            <div className=' slider-container relative rounded-r-2xl'>
            <Slider {...settings} className='w-full h-[238px]'>
                {dataCarousel.map((data) => (
                        <div className='w-full h-[240px]'>
                            <img src={data.img} alt="" className='carousel-image w-full h-full object-cover'/>
                        </div>
                ))}       
            </Slider>
            </div>
        </>
    );
}

