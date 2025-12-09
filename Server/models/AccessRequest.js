const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Denied'],
    default: 'Pending'
  }
}, { timestamps: true });


module.exports = mongoose.model('AccessRequest', accessRequestSchema);
