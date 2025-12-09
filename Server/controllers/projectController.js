const Project = require('../models/Project');
const User = require('../models/User');
const AccessRequest = require('../models/AccessRequest');

/**
 * Use Case: Fetch Dashboard Data
 * Logic:
 * - Admin: Sees ALL projects, users, and pending requests.
 * - Client: Sees ONLY projects they have approved access to.
 */
const getProjects = async (req, res) => {
  try {
    const { role, userId } = req.userData;

    if (role === 'Admin') {
      const projects = await Project.find().sort({ createdAt: -1 });
      const users = await User.find({}, '-password').sort({ createdAt: -1 });
      
      // Populate client info in requests
      const requests = await AccessRequest.find({ status: 'Pending' })
        .populate('client', 'username')
        .populate('project', 'name');

      return res.status(200).json({ projects, users, requests });
    } else {

      // Get approved requests for this client
      const approvedRequests = await AccessRequest.find({ client: userId, status: 'Approved' });
      const projectIds = approvedRequests.map(req => req.project);
      
      const projects = await Project.find({ _id: { $in: projectIds } });
      
      const allProjectsBasic = await Project.find({}, 'name'); 
      const myRequests = await AccessRequest.find({ client: userId }).populate('project', 'name');

      return res.status(200).json({ 
        projects,
        availableProjects: allProjectsBasic,
        myRequests
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

/**
 * Use Case: Create a new project
 * Validations:
 * - Restricted to 'Admin' role only.
 */
const createProject = async (req, res) => {
  try {
    if (req.userData.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { name, phone, email, startDate, endDate } = req.body;
    
    const newProject = new Project({
      name, phone, email, startDate, endDate,
      createdBy: req.userData.userId
    });
    
    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

module.exports = { getProjects, createProject };
