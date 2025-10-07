
import { useNavigate } from "react-router-dom";

// import '../Styles/style.css'

export default function ButtonNextPage() {

    const navigate = useNavigate();

    return(
        <>
            <button onClick={() => navigate('/page1')} className="border border-black-500 rounded-sm" >next page</button>
        </>
    );



}

