const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' })
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

//bcrypt
      const hashedPassword = await bcrypt.hash(password,10)
      const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student' // hardcoded, matching our frontend decision
    })

    await newUser.save()

    // Don't send the password back in the response
    res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message })
  }
})
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please fill in all fields.' })
    }

    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // Check password matches (plain text comparison for now — bcrypt comes in Phase F)
    // if (user.password !== password) {
    //   return res.status(401).json({ message: 'Invalid email or password.' })
    // }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // Check the selected role matches the user's actual role in the database
    if (user.role !== role) {
      return res.status(401).json({ message: 'Selected role does not match this account.' })
    }

    // JWT token generation goes here — added in B6
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )


    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message })
  }
})
const { verifyToken, isAdmin } = require('../middleware/auth')

// TEMPORARY — just to test middleware, can be removed later
router.get('/test-protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'You are authenticated.', user: req.user })
})

router.get('/test-admin', verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: 'You are an authenticated admin.', user: req.user })
})
module.exports = router