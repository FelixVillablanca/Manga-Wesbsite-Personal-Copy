
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Imports Pages
// import './App.css'
import Home from './Pages/Home'
import Login from './Pages/login.jsx'


export default function App(){
    return(
        <BrowserRouter> 
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/login' element={<Login />}/>
            </Routes>
        </BrowserRouter> 
    );
}
