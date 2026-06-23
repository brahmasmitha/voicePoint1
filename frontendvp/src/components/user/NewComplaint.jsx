import { Button, MenuItem, TextField } from '@mui/material'
import React, { useState } from 'react'
import Navigate from './Navigate'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
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

const NewComplaint = () => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!title || !category || !description || !location) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/complaints', { title, category, description, location })
      const complaintId = response.data.complaint._id

      navigate('/complaintsubmitted', { state: { complaintId } })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', padding: '50px' }}>
      <div>
        <Navigate />
      </div>

      <div>
        <h1>Complaint Form</h1>

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

          {error && (
            <Typography color='error' sx={{ marginBottom: '10px' }}>
              {error}
            </Typography>
          )}

          <Button
            type='submit'
            variant="contained"
            disabled={loading}
            sx={{ color: 'white', backgroundColor: '#179700' }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default NewComplaint