import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import StackedPages from './components/StackedPage'
import Team from './pages/Team'
import Robots from './pages/Robots'
import Locations from './pages/Locations'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<StackedPages />} />
          <Route path="/dashboard" element={<StackedPages />} />
          <Route path="/team" element={<Team />} />
          <Route path="/robots" element={<Robots />} />
          <Route path="/locations" element={<Locations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App