
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../Styles/style.css'

import Sidebar from '../Components/Sidebar';



export default function Admin() {

    //FOR ADMIN CREDENTIALS SESSION
    const [Admin_Credentials, setAdmin_Credentials] = useState(null);
    const navigateTo = useNavigate();
    useEffect(() => {
        const Admin = localStorage.getItem("AdminCredentials");
        if (Admin) {
            const AdminCredentials = jwtDecode(Admin) //get the {id, username, email} inisde of the jsonwebtoken
            setAdmin_Credentials(AdminCredentials)
        } else {
            navigateTo('/')
        }
    },[])
    //===============================================

    // Dashboard Statistics State
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard/statistics');
                const data = await response.json();
                if (data.success) {
                    setDashboardData(data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const StatCard = ({ title, value, icon, color, bgColor }) => (
        <div className={`${bgColor} rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <p className={`${color} text-3xl font-bold`}>{value !== null && value !== undefined ? value.toLocaleString() : '0'}</p>
                </div>
                <div className={`${color} opacity-20`}>
                    <span className="material-symbols-outlined text-5xl">{icon}</span>
                </div>
            </div>
        </div>
    );

    return(
        <>
            {Admin_Credentials && (
                <>
                    <div className=' w-auto h-screen relative flex '>
                        <Sidebar Admin={Admin_Credentials} adminSet={setAdmin_Credentials}/>
                        <main className='w-full h-screen overflow-y-auto bg-[#1a1a1a]'>
                            <div className='p-8'>
                                {/* Header */}
                                <div className='mb-8'>
                                    <h1 className='text-amber-50 text-4xl font-bold mb-2'>Dashboard</h1>
                                    <p className='text-gray-400'>Welcome back, <span className='text-amber-400'>{Admin_Credentials.username}</span></p>
                                </div>

                                {loading ? (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="text-amber-400 text-xl">Loading dashboard data...</div>
                                    </div>
                                ) : dashboardData ? (
                                    <>
                                        {/* Statistics Cards */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
                                            <StatCard 
                                                title="Total Mangas" 
                                                value={dashboardData.statistics.totalMangas} 
                                                icon="menu_book" 
                                                color="text-blue-400" 
                                                bgColor="bg-[#2a2a2a]"
                                            />
                                            <StatCard 
                                                title="Total Users" 
                                                value={dashboardData.statistics.totalUsers} 
                                                icon="people" 
                                                color="text-green-400" 
                                                bgColor="bg-[#2a2a2a]"
                                            />
                                            <StatCard 
                                                title="Total Chapters" 
                                                value={dashboardData.statistics.totalChapters} 
                                                icon="auto_stories" 
                                                color="text-purple-400" 
                                                bgColor="bg-[#2a2a2a]"
                                            />
                                            <StatCard 
                                                title="Total Views" 
                                                value={dashboardData.statistics.totalViews} 
                                                icon="visibility" 
                                                color="text-amber-400" 
                                                bgColor="bg-[#2a2a2a]"
                                            />
                                            <StatCard 
                                                title="Total Likes" 
                                                value={dashboardData.statistics.totalLikes} 
                                                icon="favorite" 
                                                color="text-red-400" 
                                                bgColor="bg-[#2a2a2a]"
                                            />
                                            <StatCard 
                                                title="Published" 
                                                value={dashboardData.statistics.publishedMangas} 
                                                icon="publish" 
                                                color="text-emerald-400" 
                                                bgColor="bg-[#2a2a2a]"
                                            />
                                            <StatCard 
                                                title="Unpublished" 
                                                value={dashboardData.statistics.unpublishedMangas} 
                                                icon="draft" 
                                                color="text-orange-400" 
                                                bgColor="bg-[#2a2a2a]"
                                            />
                                        </div>

                                        {/* Charts and Lists Section */}
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                                            {/* Top 5 Most Viewed Mangas */}
                                            <div className='bg-[#2a2a2a] rounded-lg p-6 shadow-lg'>
                                                <h2 className='text-amber-50 text-xl font-bold mb-4 flex items-center gap-2'>
                                                    <span className="material-symbols-outlined text-amber-400">trending_up</span>
                                                    Top 5 Most Viewed
                                                </h2>
                                                <div className='space-y-3'>
                                                    {dashboardData.topViewedManga && dashboardData.topViewedManga.length > 0 ? (
                                                        dashboardData.topViewedManga.map((manga, index) => (
                                                            <div key={index} className='bg-[#1a1a1a] rounded p-4 flex items-center justify-between hover:bg-[#252525] transition-colors'>
                                                                <div className='flex items-center gap-3'>
                                                                    <div className='w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold'>
                                                                        {index + 1}
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-amber-50 font-medium'>{manga.title}</p>
                                                                        <p className='text-gray-400 text-sm'>{manga.Published}</p>
                                                                    </div>
                                                                </div>
                                                                <div className='text-right'>
                                                                    <p className='text-amber-400 font-bold'>{manga.interactionCount || 0}</p>
                                                                    <p className='text-gray-500 text-xs'>views</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className='text-gray-400 text-center py-4'>No data available</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Top 5 Most Liked Mangas */}
                                            <div className='bg-[#2a2a2a] rounded-lg p-6 shadow-lg'>
                                                <h2 className='text-amber-50 text-xl font-bold mb-4 flex items-center gap-2'>
                                                    <span className="material-symbols-outlined text-red-400">favorite</span>
                                                    Top 5 Most Liked
                                                </h2>
                                                <div className='space-y-3'>
                                                    {dashboardData.topLikedManga && dashboardData.topLikedManga.length > 0 ? (
                                                        dashboardData.topLikedManga.map((manga, index) => (
                                                            <div key={index} className='bg-[#1a1a1a] rounded p-4 flex items-center justify-between hover:bg-[#252525] transition-colors'>
                                                                <div className='flex items-center gap-3'>
                                                                    <div className='w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center text-red-400 font-bold'>
                                                                        {index + 1}
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-amber-50 font-medium'>{manga.title}</p>
                                                                        <p className='text-gray-400 text-sm'>{manga.Published}</p>
                                                                    </div>
                                                                </div>
                                                                <div className='text-right'>
                                                                    <p className='text-red-400 font-bold'>{manga.likesCount || 0}</p>
                                                                    <p className='text-gray-500 text-xs'>likes</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className='text-gray-400 text-center py-4'>No data available</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Mangas */}
                                        <div className='bg-[#2a2a2a] rounded-lg p-6 shadow-lg'>
                                            <h2 className='text-amber-50 text-xl font-bold mb-4 flex items-center gap-2'>
                                                <span className="material-symbols-outlined text-blue-400">schedule</span>
                                                Recent Mangas
                                            </h2>
                                            <div className='overflow-x-auto'>
                                                <table className='w-full'>
                                                    <thead>
                                                        <tr className='border-b border-gray-700'>
                                                            <th className='text-left text-gray-400 font-medium pb-3 px-2'>Title</th>
                                                            <th className='text-left text-gray-400 font-medium pb-3 px-2'>Status</th>
                                                            <th className='text-left text-gray-400 font-medium pb-3 px-2'>Published</th>
                                                            <th className='text-left text-gray-400 font-medium pb-3 px-2'>Created</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dashboardData.recentMangas && dashboardData.recentMangas.length > 0 ? (
                                                            dashboardData.recentMangas.map((manga, index) => (
                                                                <tr key={index} className='border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors'>
                                                                    <td className='py-3 px-2'>
                                                                        <p className='text-amber-50 font-medium'>{manga.title}</p>
                                                                    </td>
                                                                    <td className='py-3 px-2'>
                                                                        <span className={`px-2 py-1 rounded text-xs ${
                                                                            manga.Status === 'Ongoing' ? 'bg-green-400/20 text-green-400' :
                                                                            manga.Status === 'Completed' ? 'bg-blue-400/20 text-blue-400' :
                                                                            'bg-gray-400/20 text-gray-400'
                                                                        }`}>
                                                                            {manga.Status || 'N/A'}
                                                                        </span>
                                                                    </td>
                                                                    <td className='py-3 px-2'>
                                                                        <span className={`px-2 py-1 rounded text-xs ${
                                                                            manga.Published === 'Published' ? 'bg-emerald-400/20 text-emerald-400' :
                                                                            'bg-orange-400/20 text-orange-400'
                                                                        }`}>
                                                                            {manga.Published || 'Unpublished'}
                                                                        </span>
                                                                    </td>
                                                                    <td className='py-3 px-2 text-gray-400 text-sm'>
                                                                        {formatDate(manga.createdAt)}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4" className='text-center text-gray-400 py-8'>No recent mangas</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="text-red-400 text-xl">Failed to load dashboard data</div>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </>
            )}
        </>
    );
}