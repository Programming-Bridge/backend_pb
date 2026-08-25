const Inquiry = require('../model/inquiry.model');
const nodemailer = require('nodemailer');

const sendEmailNotification = async (inquiry) => {
    const user = process.env.GMAIL_ACCOUNT;
    const pass = process.env.GMAIL_PASSWORD;

    if (!user || !pass) {
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });

        const recipient = process.env.NOTIFICATION_EMAIL || user;

        await transporter.sendMail({
            from: `"Website Inquiry" <${user}>`,
            to: recipient,
            subject: `🔔 New Inquiry from ${inquiry.name} (${inquiry.projectType})`,
            html: `
                <h2>New Project Inquiry Received</h2>
                <p><strong>Name:</strong> ${inquiry.name}</p>
                <p><strong>Email:</strong> ${inquiry.email}</p>
                <p><strong>Project Type:</strong> ${inquiry.projectType}</p>
                <p><strong>Budget Range:</strong> ${inquiry.budgetRange}</p>
                ${inquiry.phone ? `<p><strong>Phone:</strong> ${inquiry.phone}</p>` : ''}
                ${inquiry.company ? `<p><strong>Company:</strong> ${inquiry.company}</p>` : ''}
                <hr />
                <p><strong>Message:</strong></p>
                <p>${inquiry.message.replace(/\n/g, '<br/>')}</p>
            `,
        });
    } catch (err) {
        console.error('Email notification failed (non-critical):', err.message);
    }
};

// Create a new Inquiry (Form Submission)
exports.createInquiry = async (req, res) => {
    try {
        const {
            name,
            fullName,
            email,
            projectType,
            serviceType,
            budgetRange,
            budget,
            message,
            phone,
            company,
        } = req.body;

        const newInquiry = new Inquiry({
            name: name || fullName,
            email,
            projectType: projectType || serviceType || 'Web Development',
            budgetRange: budgetRange || budget || 'Not Specified',
            message,
            phone: phone || '',
            company: company || '',
        });

        const savedInquiry = await newInquiry.save();

        // Optional email alert
        sendEmailNotification(savedInquiry).catch(() => { });

        return res.status(201).json({
            success: true,
            message: 'Inquiry submitted successfully! We will get back to you shortly.',
            data: savedInquiry,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit inquiry',
        });
    }
};

// Get All Inquiries (with filtering, searching, and pagination)
exports.getAllInquiries = async (req, res) => {
    try {
        const { status, projectType, isRead, search, page = 1, limit = 50 } = req.query;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (projectType) {
            filter.projectType = new RegExp(projectType, 'i');
        }

        if (typeof isRead !== 'undefined') {
            filter.isRead = isRead === 'true';
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { message: searchRegex },
                { company: searchRegex },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [inquiries, total] = await Promise.all([
            Inquiry.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Inquiry.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            count: inquiries.length,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            data: inquiries,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch inquiries',
        });
    }
};

// Get Single Inquiry by ID (and mark as read)
exports.getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { returnDocument: 'after' }
        );

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: inquiry,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch inquiry',
        });
    }
};

// Update Inquiry Status (e.g. 'In Review', 'Contacted', 'Closed')
exports.updateInquiryStatus = async (req, res) => {
    try {
        const { status, isRead } = req.body;
        const updateFields = {};

        if (status) updateFields.status = status;
        if (typeof isRead !== 'undefined') updateFields.isRead = isRead === 'true' || isRead === true;

        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedInquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Inquiry status updated successfully',
            data: updatedInquiry,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update inquiry status',
        });
    }
};

// Delete Inquiry
exports.deleteInquiry = async (req, res) => {
    try {
        const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!deletedInquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Inquiry deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete inquiry',
        });
    }
};
