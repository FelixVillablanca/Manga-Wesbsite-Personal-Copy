
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../Styles/style.css'

import Sidebar from '../Components/Sidebar';



export default function Admin() {

    //FOR ADMIN CREDENTIALS SESSION
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
    //===============================================

    return(
        <>
            {Admin_Credentials && (
                <>
                    <div className=' w-auto h-screen relative flex '>
                        <Sidebar Admin={Admin_Credentials} adminSet={setAdmin_Credentials}/>
                        <main className='w-full h-screen  '>

                            <div className='text-amber-50'>admin email from localStorage: {Admin_Credentials.email}</div>
                            <h1 className='text-amber-50  '> Dashboard</h1>

                        </main>
                    </div>
                </>
            )}
        </>
    );
}