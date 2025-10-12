
import '../Styles/style.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';


export default function Header({ onLogout }) {
    const [sidebarOpen, setSidebarOpen] = useState(false) //for activation sidebar humberger

    const handleSideToggle = () => { //for sidebar(humberger btn)
        setSidebarOpen(prev => !prev)
    }




    return(
        <>
            <header className='flex relative w-auto h-[60px] items-center justify-center bg-black'>
                <h1 className='font-bold absolute left-5 text-[30px] text-white'>Manga<span className="text-amber-300 ">Verse</span></h1>
                <div className='relative flex items-center w-[40%] h-fit'>
                    <input type="search" placeholder='search' className='border w-[100%] p-2 pl-3 rounded bg-white focus:outline-none'/>
                    <button onClick={() => alert('clicked')} className='cursor-pointer absolute right-1.5 top-1.5 bg-gray-300 flex items-center justify-center w-8 h-8 rounded-full hover:bg-amber-300'>
                        <span className="material-symbols-outlined">search</span>
                    </button>
                </div>

                <button className=' hover:cursor-pointer flex absolute items-center justify-center right-14'>
                    <span className="material-symbols-outlined text-amber-50 ">mode_night</span>
                </button>
                
                <button onClick={() => handleSideToggle()} className='bg-white flex justify-center items-center rounded absolute right-5 hover:bg-amber-300 cursor-pointer'>
                    <span class="material-symbols-outlined">menu</span>
                </button>
                <div id='container-sidebar' className={`bg-amber-300 right-[1px] ${sidebarOpen ? 'w-[15%]' : 'w-0'} overflow-hidden top-0 h-screen fixed z-50 transition-all duration-300`} >
                    <div id='container-sidebar-contents' className='w-auto h-screen text-amber-50 relative flex flex-col items-center gap-2' >
                        <div className='relative w-full h-auto'>
                            <button onClick={handleSideToggle} className='flex justify-center items-center hover:cursor-ponter'>
                                <span className="material-symbols-outlined text-amber-50 ">close</span>
                            </button>
                        </div>
                        <Link to='' >
                            <span>Profile</span>
                        </Link>
                        <Link to=''>
                            <span>Favorite</span>
                        </Link>
                        <button onClick={onLogout} className='hover:cursor-pointer'>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>   
            </header>
        </>
    );
}