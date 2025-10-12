
import { Link, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

import '../Styles/style.css'

export default function Sidebar({ sidebarToggle, statusSidebar , Admin, adminSet}) {
    const navigateTo = useNavigate();

    const [dropdown, setDropdown] = useState(false);
    const handleDropDown = () => {
        setDropdown(prev => !prev)
    }

    const handleLogout = () => {
        if (Admin) {
            localStorage.removeItem("AdminCredentials");
            adminSet(null)
            useEffect(() => {
                if (!Admin) return navigateTo('/')
            })
        }
    }


    
    return(
        <>
            <div className={ ` ${statusSidebar ? 'w-[18%]' : 'w-0'}  overflow-hidden transition-all duration-75 flex pt-7 flex-col items-center relative bg-[#292929] text-white`}  id='sidebar-container'>
                <button className=' absolute top-0 right-0 hover:cursor-pointer flex items-center' onClick={sidebarToggle}>
                    <span class="material-symbols-outlined">left_panel_close</span>
                </button>
                <div className='bg-gray-950 w-[80%] rounded shadow flex items-center justify-center text-[17px]  mb-4'>
                    <span className='text-white'>Manga</span><span className='text-amber-400'>Verse</span>
                </div>
                <div id='Sidebar' className=' w-[90%] bg-[#2f3136] rounded-[5px] h-[89vh] relative'>

                    <div className='w-full p-[5px]'>
                        <Link to='' onClick={() => alert('clicked')}>
                            <span>Dashboard</span>
                        </Link>
                    </div>    
                    <div className='w-full h-auto  flex items-center relative p-[5px] '>
                            <span>Manage Manga</span>
                            <button className='flex items-center absolute right-0 cursor-pointer ' onClick={handleDropDown}>
                                {dropdown == false && (
                                    <span class="material-symbols-outlined transition-all duration-200">keyboard_arrow_down</span>
                                )}
                                {dropdown && (
                                    <span class="material-symbols-outlined transition-all duration-200 ">keyboard_arrow_up</span>
                                )}
                            </button>
                    </div>
                    <div className={`flex flex-col pl-5   ${dropdown ? 'h-[16%] p-1' : 'h-0'}  overflow-hidden transition-all duration-100 `}>
                        <div className='w-full '>
                            <Link to='' onClick={() => alert('clicked') }>
                                <span>Add Manga</span>
                            </Link>
                        </div>    
                        <div className='w-full'>
                            <Link to='' onClick={() => alert('clicked')}>
                                <span>Add Chapter</span>
                            </Link>
                        </div>    
                        <div className='w-full'>
                            <Link to='' onClick={() => alert('clicked')}>
                                <span>Edit Manga</span>
                            </Link>
                        </div>    
                        <div className='w-full'>
                            <Link to='' onClick={() => alert('clicked')}>
                                <span>Delete Manga</span>
                            </Link>
                        </div>
                    </div>

                    <div className='w-full p-[5px]'>
                        <Link to='' onClick={() => alert('clicked')}>
                            <span>User Management</span>
                        </Link>
                    </div>    
                    <div className='w-full p-[5px]  absolute bottom-3 '>
                        <Link to='' onClick={handleLogout} className='flex items-center gap-1'>
                            <span class="material-symbols-outlined ">logout</span>
                            <span>Logout</span>
                        </Link>
                    </div>    
                </div>

            </div>        
        </>
    );



}