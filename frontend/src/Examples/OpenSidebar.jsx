
import Sidebar from "../Components/Sidebar"
export default function OpenSidebar({ statusSidebar, sidebarToggle }) {
    return(
        <>
            {statusSidebar == false &&(
                <>
                    <button className="cursor-pointer" onClick={sidebarToggle}>
                        <span className="material-symbols-outlined text-amber-50">left_panel_open</span>
                    </button>
                </>
            )}
        </>
    )
}