import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Robots from './pages/Robots'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard  />} />
          <Route path="/dashboard" element={<Dashboard  />} />
          <Route path="/robots" element={<Robots />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App