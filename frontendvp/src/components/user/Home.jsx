import React, { useEffect, useState } from 'react'
import Navigate from './Navigate'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../../api/axios'

const STATUS_COLORS = {
  Pending: '#f5a623',
  'In Progress': '#1976d2',
  Resolved: '#179700'
}

const Home = () => {
  const userString = localStorage.getItem('user')
  const profile = userString ? JSON.parse(userString) : { name: 'Student' }

  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/complaints/stats/mine')
        setStats(response.data)
      } catch (err) {
        console.error('Failed to load stats', err)
      }
    }
    fetchStats()
  }, [])

  const chartData = [
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Resolved', value: stats.resolved }
  ]

  return (
    <div>
      <Navigate />

      <Box sx={{ padding: '24px' }}>
        <Card
          sx={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            color: '#179700',
            textAlign: 'left',
            marginBottom: '24px'
          }}
        >
          <Typography variant='h5' component='h2' sx={{ marginBottom: '16px' }}>
            <strong>Profile</strong>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 80, height: 80, backgroundColor: '#179700' }}>
              {profile.name.charAt(0)}
            </Avatar>

            <Typography><strong>Name:</strong> {profile.name}</Typography>
          </Box>
        </Card>

        <Grid container spacing={3} sx={{ marginBottom: '24px' }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
              <Typography variant='h4' sx={{ color: '#179700' }}>{stats.total}</Typography>
              <Typography>Total Complaints Raised</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
              <Typography variant='h4' sx={{ color: '#179700' }}>{stats.pending}</Typography>
              <Typography>Pending Complaints</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
              <Typography variant='h4' sx={{ color: '#179700' }}>{stats.resolved}</Typography>
              <Typography>Resolved</Typography>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
          <Typography variant='h6' sx={{ marginBottom: '16px' }}>
            My Complaints by Status
          </Typography>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={100}
                label
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </div>
  )
}

export default Home