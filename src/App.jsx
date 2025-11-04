import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import {Toaster} from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App