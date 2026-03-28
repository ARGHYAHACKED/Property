const Lead = require('../models/Lead');

exports.createLead = async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required' });
        }

        const newLead = new Lead({ name, phone });
        await newLead.save();

        res.status(201).json({ message: 'Lead captured successfully', lead: newLead });
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        await Lead.findByIdAndDelete(id);
        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
