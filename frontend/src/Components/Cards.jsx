
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cards({ 
    Manga_ID,
    Chapters, 
    truncatedWord, 
    truncated_Title_Hover_info, 
    genreMain, 
    chapterslength,
    imgPATH,
    Publisher 
}) {

    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        const handleMouseOver = () => setIsHovered(true);
        const handleMouseOut = () => setIsHovered(false);

        el.addEventListener("mouseover", handleMouseOver);
        el.addEventListener("mouseout", handleMouseOut);

        return () => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    // console.log('from card genre: ', genreMain)
    console.log('from card chapters length: ', chapterslength)
    console.log('from card chapters: ', Chapters)

    const [Latest_Chapters, setLatestChapters] = useState(null)
    const [New_Chapters, setNew_Chapters] = useState("")
    useEffect(() => {
        const getLatestChapters_Func = async () => {
            try {
                
                const findLatest_Chapters = await fetch('/api/Latest_Chapters', {
                    method : 'GET'
                })
    
                const response = await findLatest_Chapters.json()
    
                // if (response) {
                    setLatestChapters(response)
                    const inLatesChapter = Chapters.some(chap => response.LatestChapters.includes(chap._id))
                    console.log('in Latest Chapter: ', inLatesChapter)
                    if (inLatesChapter) {
                        setNew_Chapters('New Chapter')
                    }
                // }

            } catch (error) {
                console.error('From frontend received an error: ', error)
            }
        }
        getLatestChapters_Func();
    },[])
    // console.log('Latest Chapters: ', Latest_Chapters.LatestChapters.some(chpidfk => chpidfk === Chapters._id))

    // useEffect(() => {
    //     if (Latest_Chapters.LatestChapters.includes(Chapters._id)) {
    //         setNew_Chapters("New Chapters")
    //     }
    // },[Chapters])

    console.log('NewCHp: ', New_Chapters)
        return(
            <div ref={cardRef} className='flex flex-col w-50  relative p-2 bg-[#1a1a1a] rounded' id='card'>
                <div>
                    <img src={`http://localhost:5000${imgPATH}`} alt={truncatedWord} className='w-full h-[265px]' />
                </div>
                {New_Chapters.trim().length > 0 && (
                    <span className=" bg-amber-400 absolute p-1  bottom-7 right-[-13px] rounded border-black"
                        style={{ transform: 'scale(0.65)' }}>
                        {New_Chapters}
                    </span>
                )}
                <span className='text-[5px] text-gray-500'>
                    {genreMain?.[0]}
                </span>
                <h1 className='text-[18px]'>
                    {truncatedWord} {/* if this word length exceeds 15 words the other word should show ... */}
                </h1>
                <div className={`absolute top-0 right-0 bg-black/80 ${ isHovered ? "h-full" : "h-0" } overflow-hidden transition-all duration-300`} >
                    <div className='flex flex-col flex-wrap p-4 '>
                        <span className='text-[18px] text-amber-400'>{truncated_Title_Hover_info}</span>
                        <span>{chapterslength} Chapters</span>
                        <br />
                        <span>{genreMain.join(", ")}</span>
                        {/* <span className="relative">{Publisher}<span className="bg-amber-400 absolute transform translate-y-[-5px] translate-x-[-15px] p-1 text-[5px] rounded scale-[0.5]">Publisher</span></span> */}
                    </div>
                </div>
            </div>
        );
}