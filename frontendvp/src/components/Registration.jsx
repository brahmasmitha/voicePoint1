import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const Registration = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register', { name, email, password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '80px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: '40px'
        }}
      >
        <h1>Create a new user account</h1>
        <br />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            variant='outlined'
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ backgroundColor: 'white', marginBottom: '20px' }}
          />

          <TextField
            variant='outlined'
            label='Email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: 'white', marginBottom: '20px' }}
          />

          <TextField
            variant='outlined'
            label='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: 'white', marginBottom: '20px' }}
          />

          <TextField
            variant='outlined'
            label='Confirm Password'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ backgroundColor: 'white', marginBottom: '10px' }}
          />

          {error && (
            <Typography color='error' sx={{ marginBottom: '10px' }}>
              {error}
            </Typography>
          )}

          <Button
            type='submit'
            variant='contained'
            disabled={loading}
            sx={{ backgroundColor: '#179700', marginBottom: '20px' }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>

        <Link to='/'>
          <Typography>Go back to landing page</Typography>
        </Link>
        <br />
        <Link to='/login'>
          <Typography>Already have an account? Login</Typography>
        </Link>
        <br />
      </div>
    </div>
  )
}

export default Registration