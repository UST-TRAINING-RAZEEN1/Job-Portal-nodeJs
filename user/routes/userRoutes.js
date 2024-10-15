const express = require('express');
const User = require('../models/User');
const router = express.Router();
const axios = require("axios")


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});
router.get('/:jobId/getAllApplicants', async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const applicants = await User.find(
      { "appliedJobs.jobId": jobId },
      { username: 1, email: 1, "appliedJobs.$": 1 }
    );

    if (applicants.length === 0) {
      return res.status(404).json({ message: "No applicants found for this job." });
    }

    res.status(200).json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:userId/apply', async (req, res) => {
  const { jobId } = req.body;
  const { userId } = req.params;

  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.appliedJobs.push({ jobId });
    await user.save();

    
    
      const response = await axios.post("http://localhost:4000/jobs/apply", { jobId });
      if (response.status === 200) {
        return res.status(200).json(user);
      } else {
        
        return res.status(500).json({ message: 'Error updating job application count' });
      }
    } 
   catch (error) {
    res.status(400).json({ message: 'Error applying for job', error });
  }
}
);


router.get('/:userId/applications', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    res.status(200).json(user.appliedJobs);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching applications', error });
  }
});

router.get("/jobs", async (req, res) => {
  

    try {
      const response = await axios.get("http://localhost:4000/jobs/");
      
        return res.status(200).json(response.data);
      
    }


   catch (error) {
    res.status(500).json({ message: 'Error fetching Jobs', error });
  }
})

module.exports = router;
