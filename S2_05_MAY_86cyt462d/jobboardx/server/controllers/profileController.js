const User = require('../models/User');
const mongoose = require('mongoose');

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    let updateFields = {};

    if (req.user.role === 'seeker') {
      updateFields = {
        'profile.fullName': updates.fullName,
        'profile.bio': updates.bio,
        'profile.skills': updates.skills,
        'profile.experience': updates.experience,
        'profile.resumeLink': updates.resumeLink,
      };
    } else if (req.user.role === 'employer') {
      updateFields = {
        'profile.companyName': updates.companyName,
        'profile.industry': updates.industry,
        'profile.website': updates.website,
        'profile.location': updates.location,
      };
    } else {
      return res.status(403).json({ error: 'Invalid role for profile update.' });
    }

    console.time('⏱ DB Update');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');
 
    res.status(200).json(user);

  } catch (err) {
    console.error('❌ Profile update error:', err.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.getProfile = async (req, res) => {
  res.json(req.user);
};
