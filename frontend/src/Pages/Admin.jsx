
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../Styles/style.css'

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



    return(
        <>
            {Admin_Credentials && (
                <>
                    <div>
                        <h1 className='text-amber-50'>admin email from localStorage: {Admin_Credentials.email}</h1>
                    </div>
                </>
            )}
        </>
    );
}