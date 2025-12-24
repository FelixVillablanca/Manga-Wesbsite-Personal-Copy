
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Imports Pages
// import './App.css'
import Auth from './Pages/Auth.jsx'
import Login from './Components/Login.jsx'
import Register from './Components/Register.jsx';
import Home from './Pages/Home.jsx'
import AdminPanel from './Pages/AdminPanel.jsx'
import Add_Manga from './Pages/Add_Manga.jsx';
import Edit_Manga from './Pages/Edit_Manga.jsx';
import ViewManga from './Pages/ViewManga.jsx';
import SelectedChapterToView from './Pages/SelectedChapterToVIew.jsx';

//Reader Components endpoint
import Reader_ViewManga from './Pages/Reader_MangaView.jsx';
import ReaderChapterSelectedView from './Pages/Reader_ChapterSelectedView.jsx'

//Reader_options
import ReaderProfile from './Pages/ReaderProfile.jsx'


export default function App(){
    return(
        <BrowserRouter> 
            <Routes>
                <Route path='/' element={<Auth />}/>
                <Route path='/login' element={<Login />}/>
                <Route path='/register' element={<Register />}/>
                <Route path='/home' element={<Home />}/>
                <Route path='/AdminPanel' element={<AdminPanel />}/>
                <Route path='/Add_Manga' element={<Add_Manga />}></Route>
                <Route path='/edit-manga/:id' element={<Edit_Manga />}></Route>
                <Route path='/view-manga/:id' element={<ViewManga />}></Route>
                <Route path={'/SelectedChapter_ToBeView/:manga_id/:chapter_id/:indexChapter'} element={<SelectedChapterToView />}></Route>
                <Route path={'/Reader_manga_view/:id'} element={<Reader_ViewManga />}></Route>
                <Route path={'/Reader_ChapterSelectedView/:manga_id/:chapter_id'} element={<ReaderChapterSelectedView />}></Route>

                <Route path='/Reader_options/:Category' element={<ReaderProfile />} ></Route>
            </Routes>
        </BrowserRouter> 
    );
}
