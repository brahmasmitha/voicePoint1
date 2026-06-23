import React, { useState } from 'react'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Typography,Chip,Box,FormControl,InputLabel,Select,MenuItem,CircularProgress} from '@mui/material'
import ANavigate from './ANavigate'
import api from '../../api/axios'
import { useEffect } from 'react'

const roleColors = {
  student: 'info',
  admin: 'success'
}

const Userlist = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [roleFilter, setRoleFilter] = useState('')
  const [savedId, setSavedId] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/users/${id}/role`, { role: newRole })
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      )
      setSavedId(id)
      setTimeout(() => setSavedId(null), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role.")
    }
  }

  const filteredUsers = users.filter(
    (u) => roleFilter === '' || u.role === roleFilter
  )

  return (
    <>
      <div><ANavigate /></div>
      <div style={{ backgroundColor: '#f5f5f5', padding: '50px' }}>
        <Typography variant="h4" gutterBottom>Registered Users</Typography>

        {error && <Typography color='error' sx={{ marginBottom: '16px' }}>{error}</Typography>}

        <Box sx={{ marginBottom: '24px' }}>
          <FormControl sx={{ minWidth: 180, backgroundColor: 'white' }}>
            <InputLabel>Role</InputLabel>
            <Select
              label='Role'
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value=''>All Roles</MenuItem>
              <MenuItem value='student'>Student</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <CircularProgress sx={{ color: '#179700' }} />
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Current Role</strong></TableCell>
                  <TableCell><strong>Change Role</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={u.role} color={roleColors[u.role] || 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <FormControl size='small' sx={{ minWidth: 140, backgroundColor: 'white' }}>
                        <Select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        >
                          <MenuItem value='student'>Student</MenuItem>
                          <MenuItem value='admin'>Admin</MenuItem>
                        </Select>
                      </FormControl>
                      {savedId === u._id && (
                        <Typography sx={{ color: '#179700', fontSize: '0.8rem', marginTop: '4px' }}>
                          Updated
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found.
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

export default Userlist