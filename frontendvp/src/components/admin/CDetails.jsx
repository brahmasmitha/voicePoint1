import React, { useEffect, useState } from 'react'
import ANavigate from './ANavigate'
import { useParams, Link } from 'react-router-dom'
import {Box,Card,Chip,Typography,Button,FormControl,InputLabel,Select,MenuItem} from '@mui/material'
import api from '../../api/axios'

const statuses = ['Pending', 'In Progress', 'Resolved']

const statusColors = {
  Pending: 'warning',
  'In Progress': 'info',
  Resolved: 'success'
}

const CDetails = () => {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/complaints/${id}`)
        setComplaint(response.data)
        setStatus(response.data.status)
      } catch (err) {
        setError(err.response?.data?.message || "Complaint not found.")
      } finally {
        setLoading(false)
      }
    }
    fetchComplaint()
  }, [id])

  const handleUpdateStatus = async () => {
    setSaved(false)
    try {
      await api.put(`/complaints/${id}`, { status })
      setComplaint((prev) => ({ ...prev, status }))
      setSaved(true)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.")
    }
  }

  return (
    <div>
      <div>
        <ANavigate />
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
              <strong>Raised By:</strong> {complaint.createdBy?.name} ({complaint.createdBy?.email})
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
              <strong>Current Status:</strong>{' '}
              <Chip label={complaint.status} color={statusColors[complaint.status] || 'default'} size="small" />
            </Typography>

            <FormControl sx={{ minWidth: 200, backgroundColor: 'white', marginBottom: '16px' }}>
              <InputLabel>Update Status</InputLabel>
              <Select
                label='Update Status'
                value={status}
                onChange={(e) => { setStatus(e.target.value); setSaved(false) }}
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <br />

            <Button
              variant='contained'
              sx={{ backgroundColor: '#179700', color: 'white', marginBottom: '16px' }}
              onClick={handleUpdateStatus}
            >
              Save Status
            </Button>
            {saved && (
              <Typography sx={{ color: '#179700', marginBottom: '16px' }}>
                Status updated successfully.
              </Typography>
            )}
            <br />

            <Link to='/admin/complaints'>
              <Button variant='contained' sx={{ backgroundColor: '#179700', color: 'white' }}>
                Back to All Complaints
              </Button>
            </Link>
          </Card>
        )}
      </Box>
    </div>
  )
}

export default CDetails