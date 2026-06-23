import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Link } from 'react-router'

const Landingpage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '20px'
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: '600px',
          minHeight: '500px',
          backgroundColor: '#f5f5f5',
          padding: '40px',
          boxSizing: 'border-box'
        }}
      >
        <Stack spacing={3} alignItems='flex-start'>
          <Typography variant='h3' sx={{ color: '#179700', fontWeight: 'bold' }}>
            Voice Point
          </Typography>

          <Typography variant='h6' component='p'>
            This is a portal for our college campus, a POINT where you can raise your VOICE — concerns, complaints and suggestions.
          </Typography>

          <Typography variant='subtitle1'>
            Login or register to continue
          </Typography>

          <Stack spacing={2} sx={{ width: '100%' }}>
            <Link to='/register' style={{ textDecoration: 'none' }}>
              <Button
                variant='contained'
                fullWidth
                sx={{ backgroundColor: '#179700', color: 'white', maxWidth: '250px' }}
              >
                <strong>Register</strong>
              </Button>
            </Link>

            <Link to='/login' style={{ textDecoration: 'none' }}>
              <Button
                variant='contained'
                fullWidth
                sx={{ backgroundColor: '#179700', color: 'white', maxWidth: '250px' }}
              >
                <strong>Login</strong>
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Card>
    </div>
  )
}

export default Landingpage