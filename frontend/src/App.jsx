
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Imports Pages
// import './App.css'
import Home from './Pages/Home'
import Login from './Components/Login.jsx'
import Register from './Components/Register.jsx';


export default function App(){
    return(
        <BrowserRouter> 
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/login' element={<Login />}/>
                <Route path='/register' element={<Register />}/>
            </Routes>
        </BrowserRouter> 
    );
}
