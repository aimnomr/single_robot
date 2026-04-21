import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RosProvider } from './hooks/ROS/ROSProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RosProvider>
      <App />
    </RosProvider>
  </StrictMode>,
)
