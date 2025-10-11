import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/style.css'

import Header from '../Components/header';
import Carousel from '../Components/Carousel'
import Contents from '../Components/Contents'

export default function Home() {
    const navigate = useNavigate();


    const [userINFO, setUserINFO] = useState(null)
    useEffect(() => {
        const token = localStorage.getItem('userCredentials'); // gettin user info and the Token
        
        if (token) {
            //it gets the { id: checkUser._id, username: checkUser.username, email: checkUser.email }
            const userCredentials = jwtDecode(token) //decoding, to access the user info inside of this jsonwebtoken -  jwt.sign({}) 
            setUserINFO(userCredentials)
        } else {
            navigate('/')
        }
    },[])


    //
    const handleLogout = () => {
        localStorage.removeItem("userCredentials");
        setUserINFO(null)
        navigate('/')
        
    }
    
    return(
        <>
                {/* {userINFO && (<h1>Example using the data from jwt,  user: {userINFO.username} </h1>) } */}
                {userINFO && (
                        <>
                            <div>
                                <Header onLogout={handleLogout}/>
                            </div>
                            <div id='mainContainer'>
                                <header id='header' className=''>
                                    <Carousel />
                                </header>
                                <main id='contents' className=' bg-gray-700'>
                                    <div class="title-component-content">
                                        <label>Latest Chapters</label>
                                    </div>
                                    <Contents />

                                </main>
                                <aside id='sidebar' className=''>
                                    <h1>side</h1>
                                </aside>
                            </div>
                        </>
                    )
                }
        </>
    );
}