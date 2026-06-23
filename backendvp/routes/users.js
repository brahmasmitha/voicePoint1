const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { verifyToken, isAdmin } = require('../middleware/auth')

// GET /api/users — admin only, list all users
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching users.', error: error.message })
  }
})

// PUT /api/users/:id/role — admin only, change a user's role
router.put('/:id/role', verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body

    if (!role || !['student', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Valid role is required.' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    user.role = role
    await user.save()

    res.status(200).json({ message: 'Role updated successfully.', user: {
      id: user._id, name: user.name, email: user.email, role: user.role
    }})
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating role.', error: error.message })
  }
})

module.exports = router