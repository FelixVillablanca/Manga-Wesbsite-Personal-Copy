
import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Search({ setSearchBar, searchBar}) {

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
    
    // console.log('searched manga: ', search_filtered)

    return(
        <>
            <div className={`w-full relative flex justify-center flex-col bg-white transition-all duration-200 ${searchBar ? 'translate-x-[0%] opacity-100':'translate-x-[55%] opacity-0'} p-10 rounded overflow-hidden`}>
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
                        <Link key={manga._id} className="border flex p-1 gap-1 rounded hover:bg-gray-200" to={`/use_manga_view/${manga._id}`}>
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
                    {/* <div>
                        found content searched manga
                    </div>
                    <div>
                        found content searched manga
                    </div> */}
                </div>
                <div>
                    recommendation
                </div>
            </div>
        </>
    );
}