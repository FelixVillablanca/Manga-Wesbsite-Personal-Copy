
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Imports Pages
// import './App.css'
import Auth from './Pages/Auth.jsx'
import Login from './Components/Login.jsx'
import Register from './Components/Register.jsx';
import Home from './Pages/Home.jsx'
import Admin from './Pages/Admin.jsx';


export default function App(){
    return(
        <BrowserRouter> 
            <Routes>
                <Route path='/' element={<Auth />}/>
                <Route path='/login' element={<Login />}/>
                <Route path='/register' element={<Register />}/>
                <Route path='/home' element={<Home />}/>
                <Route path='/Admin' element={<Admin />}/>
            </Routes>
        </BrowserRouter> 
    );
}
