import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RosProvider } from './hooks/ROS/ROSProvider.jsx'
import * as ROSLIB from 'roslib'

// Expose ROSLIB globally for ros2djs compatibility
window.ROSLIB = ROSLIB

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RosProvider>
      <App />
    </RosProvider>
  // </StrictMode>,
)
