
import ButtonNextPage from "../Components/button";
import Page1 from './Page1'


import '../Styles/style.css'

export default function Home() {
    return(
        <>
            <div className="bg-red-600 p-3 border-amber-600 w-100">
                <h1>home page</h1>

                <Page1 />
                <ButtonNextPage />
            </div>
        </>
    );
}

// widht: 20%;