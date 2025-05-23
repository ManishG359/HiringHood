const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        role: {
            type: String,
            enum: ['seeker', 'employer'],
            default: 'seeker',
        },
        profile: {
            fullName: { type: String },
            bio: { type: String },
            skills: [String],
            experience: { type: String },
            resumeLink: { type: String }
          },
          company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
          },
          
    },
    { timestamps: true }
);
module.exports = mongoose.model('User', UserSchema);