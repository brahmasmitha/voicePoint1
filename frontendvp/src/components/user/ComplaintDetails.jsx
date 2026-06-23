import React, { useEffect, useState } from 'react'
import Navigate from './Navigate'
import { useParams, Link } from 'react-router-dom'
import { Box, Card, Chip, Typography, Button, CircularProgress } from '@mui/material'
import api from '../../api/axios'

const statusColors = {
  Pending: 'warning',
  'In Progress': 'info',
  Resolved: 'success'
}

const ComplaintDetails = () => {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/complaints/${id}`)
        setComplaint(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Complaint not found.")
      } finally {
        setLoading(false)
      }
    }
    fetchComplaint()
  }, [id])

  return (
    <div>
      <div>
        <Navigate />
      </div>

      <Box sx={{ backgroundColor: '#f5f5f5', padding: '50px' }}>
        <Typography variant="h4" gutterBottom>Complaint Details</Typography>

        {loading ? (
          <CircularProgress sx={{ color: '#179700' }} />
        ) : error ? (
          <Typography color='error'>{error}</Typography>
        ) : (
          <Card sx={{ maxWidth: '600px', padding: '24px' }}>
            <Typography sx={{ marginBottom: '12px' }}>
              <strong>Complaint ID:</strong> {complaint._id}
            </Typography>
            <Typography sx={{ marginBottom: '12px' }}>
              <strong>Complaint Title:</strong> {complaint.title}
            </Typography>
            <Typography sx={{ marginBottom: '12px' }}>
              <strong>Complaint Category:</strong> {complaint.category}
            </Typography>
            <Typography sx={{ marginBottom: '12px' }}>
              <strong>Complaint Description:</strong> {complaint.description}
            </Typography>
            <Typography sx={{ marginBottom: '12px' }}>
              <strong>Area of Issue:</strong> {complaint.location}
            </Typography>
            <Typography sx={{ marginBottom: '12px' }}>
              <strong>Date Submitted:</strong> {new Date(complaint.createdAt).toLocaleDateString()}
            </Typography>
            <Typography sx={{ marginBottom: '20px' }}>
              <strong>Status:</strong>{' '}
              <Chip label={complaint.status} color={statusColors[complaint.status] || 'default'} size="small" />
            </Typography>

            <Link to='/usercomplaintlist'>
              <Button variant='contained' sx={{ backgroundColor: '#179700', color: 'white' }}>
                Back to My Complaints
              </Button>
            </Link>
          </Card>
        )}
      </Box>
    </div>
  )
}

export default ComplaintDetails