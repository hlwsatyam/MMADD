const mongoose = require('mongoose');
const QRCode = require('qrcode'); // Make sure to install qrcode package

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    firstName: {
        type: String,
        required: function() {
            return this.profileCompleted;
        }
    },
    lastName: {
        type: String,
        required: function() {
            return this.profileCompleted;
        }
    },
    mobileNumber: {
        type: String,
        required: function() {
            return this.profileCompleted;
        }
    },
    address: {
        type: String,
        required: function() {
            return this.profileCompleted;
        }
    },
    pincode: {
        type: String,
        required: function() {
            return this.profileCompleted;
        }
    },
    state: {
        type: String,
        required: function() {
            return this.profileCompleted;
        }
    },
    city: {
        type: String,
        required: function() {
            return this.profileCompleted;
        }
    },
    village: {
        type: String,
        required: function() {
            return this.profileCompleted;
        }
    },
    caste: {
        type: String,
        required: function() {
            return this.profileCompleted;
        }
    },
    profileImage: {
        type: String,
        default: ''
    },


   // ✅ New Fields Added
    lookingForJob: {
        type: Boolean,
        default: false
    },
    canProvideJob: {
        type: Boolean,
        default: false
    },








    userType: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    subscriptionPlan: {
        type: String,
        enum: ['free', 'premium', 'business'],
        default: 'free'
    },
    subscriptionExpiry: {
        type: Date
    },
    qrCode: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

 userSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const data = JSON.stringify({
                userId: this._id,
                email: this.email,
                type: this.userType
            });
            this.qrCode = await QRCode.toDataURL(data);
        } catch (error) {
            console.error('QR Code generation error:', error);
        }
    }
    next();
});


module.exports = mongoose.model('User', userSchema);