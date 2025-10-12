
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../Styles/style.css'

import Sidebar from '../Components/Sidebar';
import OpenSidebar from '../Components/OpenSidebar';



export default function Admin() {
    const [Admin_Credentials, setAdmin_Credentials] = useState(null);
    const navigateTo = useNavigate();
    useEffect(() => {
        const Admin = localStorage.getItem("AdminCredentials");
        if (Admin) {
            const AdminCredentials = jwtDecode(Admin) //get the {id, username, email} inisde of the jsonwebtoken
            setAdmin_Credentials(AdminCredentials)
        } else {
            navigateTo('/')
        }
    },[])

    
    const [sidebarbutton, setSideBarButton] = useState(true)
    const handleSideBar_button = () => {
        setSideBarButton(prev => !prev)
    }


    return(
        <>
            {Admin_Credentials && (
                <>
                    <div className=' w-auto h-screen relative flex '>
                        <Sidebar sidebarToggle ={handleSideBar_button} statusSidebar ={sidebarbutton} Admin={Admin_Credentials} adminSet={setAdmin_Credentials}/>
                        <main className='w-full h-screen border '>
                            <div className='h-[20px]'>
                                <OpenSidebar statusSidebar={sidebarbutton} sidebarToggle={handleSideBar_button}/>
                            </div>
                            <h1 className='text-amber-50  '>admin email from localStorage: {Admin_Credentials.email}</h1>

                        </main>
                    </div>
                </>
            )}
        </>
    );
}