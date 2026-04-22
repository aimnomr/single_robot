import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StackedPages from './components/StackedPage'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import Robots from './pages/Robots'
import Locations from './pages/Locations'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StackedPages />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/team" element={<Team />} />
        <Route path="/robots" element={<Robots />} />
        <Route path="/locations" element={<Locations />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App