const Order = require("../../models/Order");
const DeliveryMan = require('../../models/Deliveryman/DeliveryMan');
const fs = require('fs');
const bcrypt = require("bcrypt");

// 1. Create - Add New Delivery Man
exports.addDeliveryMan = async (req, res) => {
    try {
        const { firstName, lastName, phoneCode, phoneNumber, identityType, identityNumber, address, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);


        const newDeliveryMan = new DeliveryMan({
            firstName, lastName, phoneCode, phoneNumber, identityType, identityNumber, address, email, password: hashedPassword,
            deliveryman_image: req.files['deliveryman_image'] ? req.files['deliveryman_image'][0].path : null,
            identity_image: req.files['identity_image'] ? req.files['identity_image'][0].path : null
        });

        await newDeliveryMan.save();
        res.status(201).json({ message: "Delivery Man added successfully!", data: newDeliveryMan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Read - Get All Delivery Men
exports.getAllDeliveryMen = async (req, res) => {
    try {
        const list = await DeliveryMan.find().sort({ createdAt: -1 });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Update - Edit Delivery Man
exports.updateDeliveryMan = async (req, res) => {
    try {
        const updatedData = { ...req.body };
        if (req.files['deliveryman_image']) updatedData.deliveryman_image = req.files['deliveryman_image'][0].path;
        if (req.files['identity_image']) updatedData.identity_image = req.files['identity_image'][0].path;

        const result = await DeliveryMan.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json({ message: "Updated successfully", result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Delete
exports.deleteDeliveryMan = async (req, res) => {
    try {
        await DeliveryMan.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // 1. Order ko find karein
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // 2. Agar status change ho raha hai aur wo "Delivered" hai
        if (status === "Delivered" && order.status !== "Delivered") {
            if (order.deliveryManId) {
                // Delivery Man ka totalOrders +1 kar do
                await DeliveryMan.findByIdAndUpdate(order.deliveryManId, {
                    $inc: { totalOrders: 1 }
                });
            }
        }

        // 3. Order status update karein
        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitDeliveryRating = async (req, res) => {
    try {
        const { orderId, rating } = req.body; // rating should be 1-5

        const order = await Order.findById(orderId);
        if (!order || !order.deliveryManId) return res.status(400).json({ message: "Invalid Request" });

        const dmId = order.deliveryManId;
        const dm = await DeliveryMan.findById(dmId);

        // Naya average calculate karein (Running Average formula)
        const newCount = dm.ratingCount + 1;
        const newRating = ((dm.rating * dm.ratingCount) + rating) / newCount;

        // Database update karein
        dm.rating = newRating.toFixed(1);
        dm.ratingCount = newCount;
        await dm.save();

        // Order mein bhi mark kar dein ki rating ho gayi
        order.deliveryRating = rating;
        await order.save();

        res.json({ message: "Rating submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

exports.deliveryManLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        // email check
        const deliveryMan = await DeliveryMan.findOne({ email });

        if (!deliveryMan) {
            return res.status(404).json({ message: "Delivery Man not found" });
        }

        // password compare
        const isMatch = await bcrypt.compare(password, deliveryMan.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.status(200).json({
            message: "Login successful",
            deliveryMan
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getIdentityTypes = (req, res) => {
    try {

        const identityTypes = [
            "Passport",
            "Driving License",
            "NID",
            "Company ID"
        ];

        res.status(200).json(identityTypes);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle Status (Active/Inactive)
exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validation to ensure only correct strings are sent
        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const result = await DeliveryMan.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!result) return res.status(404).json({ message: "Delivery man not found" });

        res.status(200).json({ message: `Status updated to ${status}`, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};