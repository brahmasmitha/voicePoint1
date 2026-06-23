import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
  CircularProgress
} from '@mui/material'
import Navigate from './Navigate'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const statusColors = {
  Pending: 'warning',
  'In Progress': 'info',
  Resolved: 'success'
}

function ViewAllCom() {
  const navigate = useNavigate()

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const response = await api.get('/complaints/mine')
      setComplaints(response.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const handleEdit = (id) => {
    navigate(`/editcomplaint/${id}`)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/complaints/${id}`)
      setComplaints((prev) => prev.filter((c) => c._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete complaint.")
    }
  }

  return (
    <>
      <div><Navigate /></div>
      <div style={{ backgroundColor: '#f5f5f5', padding: '50px' }}>
        <Typography variant="h4" gutterBottom>My Complaints</Typography>

        {error && <Typography color='error' sx={{ marginBottom: '16px' }}>{error}</Typography>}

        {loading ? (
          <CircularProgress sx={{ color: '#179700' }} />
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Date Submitted</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Edit</strong></TableCell>
                  <TableCell><strong>Delete</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Link
                        to={`/complaintdetails/${row._id}`}
                        style={{ color: '#179700', textDecoration: 'underline' }}
                      >
                        {row.title}
                      </Link>
                    </TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color={statusColors[row.status] || 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        sx={{ color: 'white', backgroundColor: '#179700' }}
                        onClick={() => handleEdit(row._id)}
                        disabled={row.status !== 'Pending'}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        sx={{ color: 'white', backgroundColor: '#179700' }}
                        onClick={() => handleDelete(row._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {complaints.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No complaints submitted yet.
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

export default ViewAllCom