import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

export default function Home() {
    const [userINFO, setUserINFO] = useState(null)
    useEffect(() => {
        const token = localStorage.getItem('userCredentials'); // Token
        
        if (token) {

            //it gets the { id: checkUser._id, username: checkUser.username, email: checkUser.email }
            const userCredentials = jwtDecode(token) 
            setUserINFO(userCredentials)
            
        }
    
    },[])
    
    // console.log(userINFO);
    return(
        <>
            <div>
                <h1>Home after successfully logged in</h1>
                {userINFO && (<h1>Example using the data from jwt {userINFO.username} </h1>) }
                
            </div>
        </>
    );
}