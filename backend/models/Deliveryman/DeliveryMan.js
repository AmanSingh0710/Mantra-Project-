const mongoose = require('mongoose');

const deliveryManSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneCode: { type: String, default: '+44' },
    phoneNumber: { type: String, required: true },
    identityType: { type: String, enum: ['Passport', 'Driving License', 'NID', 'Company ID'], default: 'Passport' },
    identityNumber: { type: String, required: true },
    address: { type: String },
    email: { type: String, required: true, unique: true,lowercase: true },
    password: { type: String, required: true },
    deliveryman_image: { type: String }, // File path store hoga
    identity_image: { type: String },     // File path store hoga
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    lastActive: { type: Date },
    currentLocation: {
        lat: Number,
        lng: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryMan', deliveryManSchema);