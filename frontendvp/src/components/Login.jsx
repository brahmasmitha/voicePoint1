import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import api from '../api/axios'

const Login = () => {
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!role || !email || !password) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/login', { email, password, role })
      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      if (user.role === 'admin') {
        navigate('/adminhome')
      } else {
        navigate('/userhome')
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
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
        <h1>Login to your account</h1>
        <br />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: 'white' }} variant='outlined'>
            <InputLabel>Select your Role</InputLabel>
            <Select
              label='Select your Role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value='student'>Student</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </Select>
          </FormControl>
          <br />

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
            {loading ? 'Logging in...' : 'Submit'}
          </Button>
        </form>

        <Link to='/'>
          <Typography>Go back to landing page</Typography>
        </Link>
        <br />
        <Link to='/register'>
          <Typography>Don't have an account? Register</Typography>
        </Link>
      </div>
    </div>
  )
}

export default Login