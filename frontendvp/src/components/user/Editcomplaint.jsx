import React, { useEffect, useState } from 'react'
import { Button, MenuItem, TextField, CircularProgress } from '@mui/material'
import Navigate from './Navigate'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

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

const Editcomplaint = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/complaints/${id}`)
        const complaint = response.data
        setTitle(complaint.title)
        setCategory(complaint.category)
        setDescription(complaint.description)
        setLocation(complaint.location)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load complaint.")
      } finally {
        setLoading(false)
      }
    }
    fetchComplaint()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!title || !category || !description || !location) {
      setError("Please fill in all fields.")
      return
    }

    setSubmitting(true)
    try {
      await api.put(`/complaints/${id}`, { title, category, description, location })
      navigate('/usercomplaintlist')
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update complaint.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f5f5', padding: '50px' }}>
        <Navigate />
        <CircularProgress sx={{ color: '#179700', marginTop: '20px' }} />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', padding: '50px' }}>
      <div>
        <Navigate />
      </div>
      <div>
        <h1>Edit Complaint Form</h1>

        {error && (
          <Typography color='error' sx={{ marginBottom: '10px' }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Complaint Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ width: '500px', backgroundColor: 'white' }}
            required
          /><br /><br />

          <FormControl sx={{ width: '500px', backgroundColor: 'white' }} variant='outlined'>
            <InputLabel>Complaint Category</InputLabel>
            <Select
              label='Complaint Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl> <br /><br />

          <TextField
            label="Complaint Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ width: '500px', backgroundColor: 'white' }}
            multiline
            rows={4}
          /><br /><br />

          <TextField
            label="Location (area of issue)"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ width: '500px', backgroundColor: 'white' }}
          /><br /><br />

          <Button
            type='submit'
            variant="contained"
            disabled={submitting}
            sx={{ color: 'white', backgroundColor: '#179700' }}
          >
            {submitting ? 'Updating...' : 'Update Complaint'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Editcomplaint