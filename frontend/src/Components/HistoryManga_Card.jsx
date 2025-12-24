import '../Styles/style.css'
import { useNavigate } from 'react-router-dom';

export default function HistoryManga_Card ({ manga_id, image, title, Genre, Chapters }) {

    const navigateTo = useNavigate();
    const func_Redirect = (id) => {
        navigateTo(`/Reader_manga_view/${id}`)
    }

    return(
        <>
            <div className="border w-full odd:bg-amber-50 hover:bg-gray-200 rounded cursor-pointer" onClick={() => func_Redirect(manga_id)}>
                <div className="flex gap-4 p-2">
                    <img src={`http://localhost:5000${image}`} alt="Manga Cover" className="w-20 h-20 object-contain rounded"/>
                    <div className="flex flex-col justify-center">
                        <span className="font-medium">{title}</span>
                        <span className="text-sm text-gray-700">{JSON.parse(Genre).join(', ')}</span>
                        <span className="text-xs text-gray-500">{Chapters} Chapters</span>
                    </div>
                </div>
            </div>  
        </>
    );
}