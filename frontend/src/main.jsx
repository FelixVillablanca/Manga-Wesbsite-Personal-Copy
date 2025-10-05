import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//import styles
import './Styles/style.css'


//Import components
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
