import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token')
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : null

  if (!token || !user) {
    return <Navigate to='/login' replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    // Logged in, but wrong role for this route — send them to their own home
    return <Navigate to={user.role === 'admin' ? '/adminhome' : '/userhome'} replace />
  }

  return children
}

export default ProtectedRoute