
import React, { useState } from 'react'
import {CircularProgress,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Typography,Chip,Box,FormControl,InputLabel,Select,MenuItem,TextField} from '@mui/material'
import ANavigate from './ANavigate'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useEffect } from 'react'

const categories = [
  'Classroom',
  'Laboratory',
  'Hostel',
  'Library',
  'Internet/Wi-Fi',
  'Electrical',
  'Water Supply',
  'Cleanliness',
  'Other'
]

const statuses = ['Pending', 'In Progress', 'Resolved']

const statusColors = {
  Pending: 'warning',
  'In Progress': 'info',
  Resolved: 'success'
}

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const params = {}
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.status = statusFilter
      if (dateFilter) params.date = dateFilter

      const response = await api.get('/complaints', { params })
      setComplaints(response.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [categoryFilter, statusFilter, dateFilter])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/complaints/${id}`, { status: newStatus })
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      )
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.")
    }
  }

  return (
    <>
      <div><ANavigate /></div>
      <div style={{ backgroundColor: '#f5f5f5', padding: '50px' }}>
        <Typography variant="h4" gutterBottom>All Complaints</Typography>

        {error && <Typography color='error' sx={{ marginBottom: '16px' }}>{error}</Typography>}

        <Box sx={{ display: 'flex', gap: 2, marginBottom: '24px', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200, backgroundColor: 'white' }}>
            <InputLabel>Category</InputLabel>
            <Select
              label='Category'
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value=''>All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180, backgroundColor: 'white' }}>
            <InputLabel>Status</InputLabel>
            <Select
              label='Status'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value=''>All Statuses</MenuItem>
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type='date'
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {loading ? (
          <CircularProgress sx={{ color: '#179700' }} />
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Raised By</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                  <TableCell><strong>Date Submitted</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Update Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Link
                        to={`/admin/complaint/${row._id}`}
                        style={{ color: '#179700', textDecoration: 'underline' }}
                      >
                        {row.title}
                      </Link>
                    </TableCell>
                    <TableCell>{row.createdBy?.name || 'Unknown'}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color={statusColors[row.status] || 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <FormControl size='small' sx={{ minWidth: 140, backgroundColor: 'white' }}>
                        <Select
                          value={row.status}
                          onChange={(e) => handleStatusChange(row._id, e.target.value)}
                        >
                          {statuses.map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
                {complaints.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No complaints match the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </>
  )
}

export default AllComplaints