const express = require('express')
const router = express.Router()
const Complaint = require('../models/Complaint')
const { verifyToken, isAdmin } = require('../middleware/auth')

// POST /api/complaints
// GET /api/complaints/mine — student's own complaints
// GET /api/complaints/stats/mine — student's own stats
router.get('/stats/mine', verifyToken, async (req, res) => {
  try {
    const total = await Complaint.countDocuments({ createdBy: req.user.id })
    const pending = await Complaint.countDocuments({ createdBy: req.user.id, status: 'Pending' })
    const inProgress = await Complaint.countDocuments({ createdBy: req.user.id, status: 'In Progress' })
    const resolved = await Complaint.countDocuments({ createdBy: req.user.id, status: 'Resolved' })

    res.status(200).json({ total, pending, inProgress, resolved })
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching stats.', error: error.message })
  }
})

// GET /api/complaints/stats — admin stats, all complaints
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const total = await Complaint.countDocuments()
    const pending = await Complaint.countDocuments({ status: 'Pending' })
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' })
    const resolved = await Complaint.countDocuments({ status: 'Resolved' })

    res.status(200).json({ total, pending, inProgress, resolved })
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching stats.', error: error.message })
  }
})
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json(complaints)
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching complaints.', error: error.message })
  }
})

// GET /api/complaints — all complaints (admin only), supports optional filters
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { category, status, date } = req.query
    const filter = {}

    if (category) filter.category = category
    if (status) filter.status = status
    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate() + 1)
      filter.createdAt = { $gte: start, $lt: end }
    }

    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json(complaints)
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching complaints.', error: error.message })
  }
})

// GET /api/complaints/:id — single complaint
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('createdBy', 'name email')

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' })
    }

    // Students can only view their own complaint; admins can view any
    const isOwner = complaint.createdBy._id.toString() === req.user.id
    const isAdminUser = req.user.role === 'admin'

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: 'Access denied.' })
    }

    res.status(200).json(complaint)
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching complaint.', error: error.message })
  }
})
// PUT /api/complaints/:id — student edits content, admin updates status
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' })
    }

    const isOwner = complaint.createdBy.toString() === req.user.id
    const isAdminUser = req.user.role === 'admin'

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: 'Access denied.' })
    }

    if (isAdminUser) {
      // Admins can only update status
      const { status } = req.body
      if (!status) {
        return res.status(400).json({ message: 'Status is required.' })
      }
      complaint.status = status
    } else {
      // Students can only edit content, and only while still Pending
      if (complaint.status !== 'Pending') {
        return res.status(403).json({ message: 'This complaint can no longer be edited.' })
      }

      const { title, category, description, location } = req.body
      if (!title || !category || !description || !location) {
        return res.status(400).json({ message: 'Please fill in all fields.' })
      }

      complaint.title = title
      complaint.category = category
      complaint.description = description
      complaint.location = location
    }

    await complaint.save()
    res.status(200).json({ message: 'Complaint updated successfully.', complaint })
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating complaint.', error: error.message })
  }
})
// DELETE /api/complaints/:id — student deletes their own complaint
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' })
    }

    const isOwner = complaint.createdBy.toString() === req.user.id

    if (!isOwner) {
      return res.status(403).json({ message: 'Access denied.' })
    }

    await Complaint.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Complaint deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting complaint.', error: error.message })
  }
})
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, category, description, location } = req.body

    if (!title || !category || !description || !location) {
      return res.status(400).json({ message: 'Please fill in all fields.' })
    }

    const newComplaint = new Complaint({
      title,
      category,
      description,
      location,
      status: 'Pending',
      createdBy: req.user.id // pulled from the verified JWT, not from req.body
    })

    await newComplaint.save()

    res.status(201).json({
      message: 'Complaint submitted successfully.',
      complaint: newComplaint
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating complaint.', error: error.message })
  }
})

module.exports = router