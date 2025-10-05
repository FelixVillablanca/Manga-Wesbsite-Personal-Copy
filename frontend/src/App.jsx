
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Imports Pages
// import './App.css'
import Home from './Pages/Home'
import Page1 from './Pages/Page1.jsx'


export default function App(){
    return(
        <BrowserRouter> 
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/page1' element={<Page1 />}/>
            </Routes>
        </BrowserRouter> 
    );
}
