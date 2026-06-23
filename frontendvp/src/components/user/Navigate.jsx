import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Link } from 'react-router'
import { useNavigate } from 'react-router-dom'

const Navigate = () => {
  const navigate=useNavigate()
  return (
    <div>
      <AppBar position='static' sx={{ backgroundColor: '#179700', px: 4 }}>
        <Toolbar>
          <Typography variant='h4' sx={{ flexGrow: 1 }}>
            <b>Voice Point</b>
          </Typography>

          <Stack direction='row' spacing={2}>
            <Link to='/userhome' style={{ textDecoration: 'none' }}>
              <Button variant='contained' sx={{ color: '#179700', backgroundColor: 'white' }}>
                <strong>Dashboard</strong>
              </Button>
            </Link>

            <Link to='/newcomplaint' style={{ textDecoration: 'none' }}>
              <Button variant='contained' sx={{ color: '#179700', backgroundColor: 'white' }}>
                <strong>New Complaint</strong>
              </Button>
            </Link>

            <Link to='/usercomplaintlist' style={{ textDecoration: 'none' }}>
              <Button variant='contained' sx={{ color: '#179700', backgroundColor: 'white' }}>
                <strong>My Complaints</strong>
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

      {/* spacing to keep page content clear of the fixed/static nav bar */}
      <Box sx={{ height: '32px' }} />
    </div>
  )
}

export default Navigate