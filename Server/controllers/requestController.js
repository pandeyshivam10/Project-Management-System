const AccessRequest = require('../models/AccessRequest');

/**
 * Use Case: Client requests access to a project
 * Validations:
 * - Restricted to 'Client' role.
 * - Checks for duplicate requests (Pending, Approved, Denied).
 */
const requestAccess = async (req, res) => {
  try {
    if (req.userData.role !== 'Client') {
      return res.status(403).json({ message: 'Only clients can request access' });
    }

    const { projectId } = req.body;
    
    // Check if request already exists
    const existing = await AccessRequest.findOne({ client: req.userData.userId, project: projectId });
    if (existing) {
      if (existing.status === 'Pending') return res.status(400).json({ messge: 'Request already pending' });
      if (existing.status === 'Approved') return res.status(400).json({ message: 'Already have access' });
      return res.status(400).json({ message: 'Request previously denied' });
    }
    
    const request = new AccessRequest({
      client: req.userData.userId,
      project: projectId
    });
    
    await request.save();
    res.status(201).json({ message: 'Access requested' });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting access', error: error.message });
  }
};

/*
 * Use Case: Admin approves or denies a request
 * Validations:
 * - Restricted to 'Admin' role.
 * - Status must be 'Approved' or 'Denied'.
 */
const handleRequest = async (req, res) => {
  try {
    if (req.userData.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { requestId, status } = req.body; // status: 'Approved' or 'Denied'
    
    if (!['Approved', 'Denied'].includes(status)) {
       return res.status(400).json({ message: 'Invalid status' });
    }

    await AccessRequest.findByIdAndUpdate(requestId, { status });
    res.status(200).json({ message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error handling request', error: error.message });
  }
};

module.exports = { requestAccess, handleRequest };
