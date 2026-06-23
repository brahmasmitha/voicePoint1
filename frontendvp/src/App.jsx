import './App.css'
import { Route, Routes } from 'react-router-dom'
import Landingpage from './components/Landingpage'
import Registration from './components/Registration'
import Login from './components/Login'
import Home from './components/user/Home'
import NewComplaint from './components/user/NewComplaint'
import NewComSubmitted from './components/user/NewComSubmitted'
import ViewAllCom from './components/user/ViewAllCom'
import ComplaintDetails from './components/user/ComplaintDetails'
import Editcomplaint from './components/user/Editcomplaint'
import AHome from './components/admin/AHome'
import AllComplaints from './components/admin/AllComplaints'
import CDetails from './components/admin/CDetails'
import Userlist from './components/admin/Userlist'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* common */}
      <Route path='/' element={<Landingpage/>}/>
      <Route path='/register' element={<Registration/>}/>
      <Route path='/login' element={<Login/>}/>

      {/* user — protected, student only */}
      <Route path='/userhome' element={<ProtectedRoute allowedRole='student'><Home/></ProtectedRoute>}/>
      <Route path='/newcomplaint' element={<ProtectedRoute allowedRole='student'><NewComplaint/></ProtectedRoute>}/>
      <Route path='/complaintsubmitted' element={<ProtectedRoute allowedRole='student'><NewComSubmitted/></ProtectedRoute>}/>
      <Route path='/editcomplaint/:id' element={<ProtectedRoute allowedRole='student'><Editcomplaint/></ProtectedRoute>}/>
      <Route path='/usercomplaintlist' element={<ProtectedRoute allowedRole='student'><ViewAllCom/></ProtectedRoute>}/>
      <Route path='/complaintdetails/:id' element={<ProtectedRoute allowedRole='student'><ComplaintDetails/></ProtectedRoute>}/>

      {/* admin — protected, admin only */}
      <Route path='/adminhome' element={<ProtectedRoute allowedRole='admin'><AHome/></ProtectedRoute>}/>
      <Route path='/admin/complaints' element={<ProtectedRoute allowedRole='admin'><AllComplaints/></ProtectedRoute>}/>
      <Route path='/admin/complaint/:id' element={<ProtectedRoute allowedRole='admin'><CDetails/></ProtectedRoute>}/>
      <Route path='/admin/users' element={<ProtectedRoute allowedRole='admin'><Userlist/></ProtectedRoute>}/>
    </Routes>
  )
}

export default App