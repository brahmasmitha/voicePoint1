import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Link, useNavigate } from 'react-router-dom'

const ANavigate = () => {
  const navigate=useNavigate()
  return (
    <div>
      <AppBar position='static' sx={{ backgroundColor: '#179700', px: 4 }}>
        <Toolbar>
          <Typography variant='h4' sx={{ flexGrow: 1 }}>
            <b>Voice Point</b>
          </Typography>

          <Stack direction='row' spacing={2}>
            <Link to='/adminhome' style={{ textDecoration: 'none' }}>
              <Button variant='contained' sx={{ color: '#179700', backgroundColor: 'white' }}>
                <strong>Dashboard</strong>
              </Button>
            </Link>

            <Link to='/admin/complaints' style={{ textDecoration: 'none' }}>
              <Button variant='contained' sx={{ color: '#179700', backgroundColor: 'white' }}>
                <strong>Complaints</strong>
              </Button>
            </Link>

            <Link to='/admin/users' style={{ textDecoration: 'none' }}>
              <Button variant='contained' sx={{ color: '#179700', backgroundColor: 'white' }}>
                <strong>Users List</strong>
              </Button>
            </Link>

            <Button
              variant='contained'
              sx={{ color: '#179700', backgroundColor: 'white' }}
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigate('/')
              }}>
              <strong>Logout</strong>
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: '32px' }} />
    </div>
  )
}

export default ANavigate