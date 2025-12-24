
import { useEffect, useState } from 'react'
import { useNavigate, Link, useParams} from 'react-router-dom'
import '../Styles/style.css'

import defaultProfile from '../assets/User-default-image.jpg'
import mangaExample from '../assets/solo-leveling-vol-02-gn-manga.webp'

import { jwtDecode } from 'jwt-decode'

// Components
import Header from '../Components/Header'
import Liked from '../Components/OptionLiked'
import History from '../Components/OptionHistory'

export default function ReaderProfile() {
    
    // ============================================
    // GET URL PARAMETER (Category: Profile, Liked, History)
    // ============================================
    const { Category } = useParams()
    
    // ============================================
    // GET USER SESSION FROM LOCAL STORAGE
    // ============================================
    const [Reader_Session, setReader_Session] = useState(null)
    useEffect(() => {
        const Reader_Session_Token = localStorage.getItem('Reader_Credentials');
        if (Reader_Session_Token) {
            const decoded_session = jwtDecode(Reader_Session_Token);
            setReader_Session(decoded_session)
        }
    },[])
    
    // ============================================
    // PROFILE IMAGE PREVIEW STATE
    // ============================================
    const [previewImage, setPreviewImage] = useState(Reader_Session?.image ? Reader_Session?.image : defaultProfile)
    const func_setPreview_image = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file)
            setPreviewImage(imageURL)
        }
    }
    
    // ============================================
    // TOGGLE UPDATE PROFILE FORM
    // ============================================
    const [continueUpdate_Profile, setContinueUpdate_Profile] = useState(false)
    const func_UpdateProfile = () => {
        setContinueUpdate_Profile(prev => !prev)
    }
    
    // ============================================
    // TOGGLE CHANGE PASSWORD SECTION
    // ============================================
    const[proceed_changepassword, setProceedChangePassword] = useState(false)
    const func_setProceedChangePassword = () => {
        setProceedChangePassword(prev => !prev)
    }
    
    // ============================================
    // USERNAME AND EMAIL INPUT STATES
    // ============================================
    const [username_changes, setUsername] = useState()
    const [email_changes, setEmail] = useState()
    useEffect(() => {
        if (Reader_Session) {
            setUsername(Reader_Session.username)
            setEmail(Reader_Session.email)
        }
    },[Reader_Session])
    
    // ============================================
    // PASSWORD INPUT STATES
    // ============================================
    const [typedPassword, setTypedPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    // ============================================
    // TOGGLE PASSWORD VISIBILITY
    // ============================================
    const [see, setSee] = useState(false)
    const func_toggleSeePassword = () => {
        setSee(prev => !prev)
    }
    
    // ============================================
    // ALERT MESSAGE STATES
    // ============================================
    const [Alert, setAlert] = useState('')
    const [messagePoppup, setMessagePoppup] = useState('')
    useEffect(() => {
        if (Alert.trim().length > 0) {
            setTimeout(() => {
                setAlert('')
                setMessagePoppup('')
            }, 3000);
        }
    },[Alert])
    
    // ============================================
    // SUBMIT PROFILE CHANGES FUNCTION
    // ============================================
    const func_Submit_Changes_Profile = async (event) => {
        event.preventDefault()
        
        const username = username_changes.trim().length > 0 ? username_changes : Reader_Session?.username;
        const email = email_changes.trim().length > 0 ? email_changes : Reader_Session?.email;
        
        try {
            const formdata = new FormData();
                formdata.append('username', username)
                formdata.append('email', email)
    
                if (proceed_changepassword) {
                    if (typedPassword !== confirmPassword) {
                        setAlert('ErrorNotMatched')
                        setMessagePoppup('Password not matched!')
                        return
                    }
                    formdata.append('isInclude_Pass', 'true')
                    formdata.append('new_password', confirmPassword)
                    
                } else {
                    formdata.append('isInclude_Pass', 'false')
                }
    
                const file_UserImageUpload = event.target.file_Image_Upload?.files[0];
                if (file_UserImageUpload) {
                    formdata.append('User_image', file_UserImageUpload)
                } 

    
                const url = file_UserImageUpload 
                    ? `/api/UserProfileUpdate_with_file_Uploaded/${Reader_Session?.id}`
                    : `/api/UserProfileUpdate_without_file/${Reader_Session?.id}`
                
                //for without file
                //no changes on password
                const fieldsNoPass = {
                    username : username,
                    email : email,
                    isInclude_Pass : 'false'
                }

                const fieldsWithPass = {
                    username : username,
                    email : email,
                    new_password : confirmPassword,
                    isInclude_Pass : 'true'
                } 

                const result = await fetch(url, {
                    method : 'PUT',
                    headers : file_UserImageUpload ? undefined : {'Content-Type' : 'application/json'},
                    body : file_UserImageUpload ? formdata : JSON.stringify(proceed_changepassword ? fieldsWithPass : fieldsNoPass)
                })

                if (!result.ok) {
                    const errorText = await result.text();
                    console.error('Server error:', errorText);
                    return;
                }

                const response = await result.json();
                console.log('Raw response:', response);

                if (response?.user) {
                    setAlert('SuccessfullChanges')
                    setMessagePoppup(response.message)
                    
                    if (response?.token) {
                        localStorage.setItem('Reader_Credentials', response?.token)
                        const updateSession_decoded = jwtDecode(response.token)
                        console.log('Updated session: ',updateSession_decoded)
                        setReader_Session(updateSession_decoded)
                    }
                }
                
            } catch (error) {
                console.error('From frontend Error: ', error)
            }
    }

    useEffect(() => {
        if (Reader_Session) {
            console.log('Updated: ', Reader_Session)
        }
    },[Reader_Session])

    // ============================================
    // MAIN RENDER
    // ============================================
    return(
        <div className='w-full min-h-screen bg-[#1a1a1a] relative select-none'>
            {/* Header Component */}
            <div>
                <Header />
            </div>

            {/* Main Profile Container */}
            <div className='flex justify-center items-start py-6 px-4 select-none'>
                <section className='flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden'>
                    
                    {/* ============================================
                        SIDEBAR - USER INFO & NAVIGATION
                        ============================================ */}
                    <aside className='w-full lg:w-80 bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 lg:border-r border-gray-200'>
                        {/* Profile Image */}
                        <div className='flex justify-center pt-4 pb-6'>
                            <div className='relative'>
                                <img 
                                    src={Reader_Session?.image ? `http://localhost:5000${Reader_Session?.image}` : defaultProfile} 
                                    alt="Profile" 
                                    className='w-32 h-32 rounded-full border-4 border-amber-400 shadow-lg object-cover' 
                                />
                                <div className='absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900'></div>
                            </div>
                        </div>

                        {/* Username */}
                        <div className='flex justify-center pb-6 border-b border-gray-700'>
                            <h2 className='text-xl font-semibold text-amber-50'>
                                {Reader_Session?.username || "Loading...."}
                            </h2>
                        </div>

                        {/* Navigation Menu */}
                        <div className='flex flex-col pt-6 gap-2'>
                            <Link 
                                to={`/Reader_options/${'Profile'}`}
                                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                                    Category === 'Profile' 
                                        ? 'bg-amber-400 text-gray-900 font-semibold shadow-md' 
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined">person</span>
                                <span>Profile</span>
                            </Link>
                            
                            <Link 
                                to={`/Reader_options/${'Liked'}`}
                                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                                    Category === 'Liked' 
                                        ? 'bg-amber-400 text-gray-900 font-semibold shadow-md' 
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined">favorite</span>
                                <span>Liked</span>
                            </Link>
                            
                            <Link 
                                to={`/Reader_options/${'History'}`}
                                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                                    Category === 'History' 
                                        ? 'bg-amber-400 text-gray-900 font-semibold shadow-md' 
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined">history</span>
                                <span>History</span>
                            </Link>
                        </div>
                    </aside>

                    {/* ============================================
                        MAIN CONTENT AREA
                        ============================================ */}
                    <main className='w-full flex flex-col bg-white p-6 lg:p-8 select-none min-h-[500px]'>
                        
                        {/* PROFILE SECTION */}
                        {Category === "Profile" && (
                            <>
                                {/* Welcome View - When not editing */}
                                {!continueUpdate_Profile && (
                                    <div className='flex flex-col gap-6'>
                                        <div className='border-b border-gray-200 pb-4'>
                                            <h1 className='text-3xl font-bold text-gray-800'>
                                                Welcome back, <span className='text-amber-500'>{Reader_Session?.username || "Loading..."}</span>!
                                            </h1>
                                            <p className='text-gray-500 mt-2'>Manage your profile settings and preferences</p>
                                        </div>
                                        
                                        <button 
                                            className='w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer'
                                            onClick={func_UpdateProfile}
                                        >
                                            Update Profile
                                        </button>
                                    </div>
                                )}

                                {/* Update Profile Form */}
                                {continueUpdate_Profile && (
                                    <form 
                                        className='flex flex-col items-center justify-center w-full max-w-2xl mx-auto relative' 
                                        onSubmit={func_Submit_Changes_Profile}
                                    >
                                        {/* Form Header */}
                                        <div className='w-full border-b border-gray-200 pb-4 mb-8'>
                                            <h2 className='text-3xl font-bold text-gray-800'>
                                                Update Your Profile
                                            </h2>
                                            <p className='text-gray-500 mt-1'>Make changes to your account information</p>
                                        </div>

                                        {/* Profile Image Upload Section */}
                                        <div className='flex flex-col items-center mb-8 w-full'>
                                            <div className='relative mb-4'>
                                                <img 
                                                    src={previewImage} 
                                                    alt="Profile preview" 
                                                    className='w-32 h-32 rounded-full border-4 border-gray-200 object-cover shadow-lg'
                                                />
                                            </div>
                                            <label className='cursor-pointer'>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    name="file_Image_Upload" 
                                                    onChange={func_setPreview_image}
                                                    accept="image/*"
                                                />
                                                <span className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium'>
                                                    Change Photo
                                                </span>
                                            </label>
                                        </div>

                                        {/* Form Fields Container */}
                                        <div className='w-full space-y-6 mb-6'>
                                            {/* Username and Email Row */}
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                                {/* Username Field */}
                                                <div className='flex flex-col gap-2'>
                                                    <label htmlFor='username' className='text-gray-700 font-medium'>
                                                        Username
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        placeholder={Reader_Session?.username || "Enter username"} 
                                                        name='username'
                                                        value={username_changes || ''}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                                                    />
                                                </div>

                                                {/* Email Field */}
                                                <div className='flex flex-col gap-2'>
                                                    <label htmlFor='email' className='text-gray-700 font-medium'>
                                                        Email
                                                    </label>
                                                    <input 
                                                        type="email" 
                                                        placeholder={Reader_Session?.email || "Enter email"} 
                                                        name='email'
                                                        value={email_changes || ''}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                                                    />
                                                </div>
                                            </div>

                                            {/* Password Change Section */}
                                            {proceed_changepassword && (
                                                <div className='relative p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4'>
                                                    {/* Cancel Button */}
                                                    <button 
                                                        type='button' 
                                                        className='absolute top-4 right-4 text-red-500 hover:text-red-600 font-medium text-sm transition-colors'
                                                        onClick={func_setProceedChangePassword}
                                                    >
                                                        Cancel
                                                    </button>

                                                    {/* Password Field */}
                                                    <div className='flex flex-col gap-2'>
                                                        <label htmlFor="password" className='text-gray-700 font-medium'>
                                                            New Password
                                                        </label>
                                                        <div className='flex items-center gap-2'>
                                                            <input 
                                                                placeholder="Enter new password"
                                                                type={see ? 'text' : 'password'}
                                                                name='password'
                                                                value={typedPassword}
                                                                onChange={(e) => setTypedPassword(e.target.value)}
                                                                className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                                                                required 
                                                            />
                                                            <button 
                                                                type='button' 
                                                                className='p-3 text-gray-500 hover:text-gray-700 transition-colors' 
                                                                onClick={func_toggleSeePassword}
                                                            >
                                                                {see ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Confirm Password Field */}
                                                    <div className='flex flex-col gap-2'>
                                                        <label htmlFor="ConfirmPassword" className='text-gray-700 font-medium'>
                                                            Confirm Password
                                                        </label>
                                                        <input 
                                                            placeholder='Confirm new password'
                                                            type={see ? 'text' : 'password'}
                                                            name='ConfirmPassword'
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className={`px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                                                typedPassword.length > 0 && confirmPassword.length > 0 && confirmPassword !== typedPassword
                                                                    ? 'border-2 border-red-500 focus:ring-red-400' 
                                                                    : 'border border-gray-300 focus:ring-amber-400 focus:border-transparent'
                                                            }`}
                                                            required
                                                        />
                                                        {typedPassword.length > 0 && confirmPassword.length > 0 && confirmPassword !== typedPassword && (
                                                            <p className='text-red-500 text-sm'>Passwords do not match</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Change Password Link */}
                                        {!proceed_changepassword && (
                                            <div className='mb-6 w-full'>
                                                <button 
                                                    type='button'
                                                    className='text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors'
                                                    onClick={func_setProceedChangePassword}
                                                >
                                                    Change Password?
                                                </button>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button 
                                            type='submit' 
                                            className='w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer'
                                        >
                                            Save Changes
                                        </button>

                                        {/* Success Alert */}
                                        <div className={`${
                                            Alert === 'SuccessfullChanges' 
                                                ? 'opacity-100 translate-y-0' 
                                                : 'opacity-0 -translate-y-4 pointer-events-none'
                                        } fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-green-500 text-white p-4 rounded-lg shadow-xl flex items-center gap-3 transition-all duration-300 z-50`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            <span className='font-medium'>{messagePoppup}</span>
                                        </div>

                                        {/* Error Alert */}
                                        <div className={`${
                                            Alert === 'ErrorNotMatched' 
                                                ? 'opacity-100 translate-y-0' 
                                                : 'opacity-0 -translate-y-4 pointer-events-none'
                                        } fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-red-500 text-white p-4 rounded-lg shadow-xl flex items-center gap-3 transition-all duration-300 z-50`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                            </svg>
                                            <span className='font-medium'>{messagePoppup}</span>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}

                        {/* LIKED SECTION */}
                        {Category === 'Liked' && <Liked userID={Reader_Session?.id}/>}
                        
                        {/* HISTORY SECTION */}
                        {Category === 'History' && <History userID={Reader_Session?.id}/>}
                    </main>
                </section>
            </div>
        </div>
    )
}