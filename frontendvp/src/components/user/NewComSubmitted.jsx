import React from 'react'
import Navigate from './Navigate'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@mui/material'
import Typography from '@mui/material/Typography'

const NewComSubmitted = () => {
  const location = useLocation()
  const complaintId = location.state?.complaintId

  return (
    <div>
      <div>
        <Navigate />
      </div>
      <div style={{ padding: '50px' }}>
        <Typography variant='h5'><strong>Complaint Submitted Successfully!</strong></Typography>
        <br />
        <Typography variant='subtitle1'>
          Your Complaint ID is {complaintId ? <strong>{complaintId}</strong> : 'unavailable'}
        </Typography>
        <br />
        <Link to={'/usercomplaintlist'}>
          <Button variant='contained' sx={{ backgroundColor: '#179700', color: 'white' }}>
            View all complaints
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NewComSubmitted