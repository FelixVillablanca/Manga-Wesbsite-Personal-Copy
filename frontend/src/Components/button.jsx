
import { useNavigate } from "react-router-dom";

export default function ButtonNextPage() {

    const navigate = useNavigate();

    return(
        <>
            <button onClick={() => navigate('/page1')} >next page</button>
        </>
    );
}

