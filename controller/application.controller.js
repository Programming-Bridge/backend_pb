const Application = require('../model/application.model');
const nodemailer = require('nodemailer');

// Send email notification to company official email
const sendJobApplicationEmail = async (application, fileAttachment = null) => {
    const user = process.env.GMAIL_ACCOUNT;
    const pass = process.env.GMAIL_PASSWORD;

    if (!user || !pass) {
        console.log('Official email credentials not set in .env. Application saved in database.');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });

        const recipient = process.env.NOTIFICATION_EMAIL || process.env.OFFICIAL_EMAIL || user;

        const mailOptions = {
            from: `"Career Portal" <${user}>`,
            to: recipient,
            subject: `🚀 New Job Application: ${application.roleApplied} - ${application.fullName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 8px;">
                        New Job Application Received
                    </h2>
                    <p><strong>Applicant Name:</strong> ${application.fullName}</p>
                    <p><strong>Email Address:</strong> <a href="mailto:${application.email}">${application.email}</a></p>
                    ${application.phone ? `<p><strong>Phone / WhatsApp:</strong> ${application.phone}</p>` : ''}
                    <p><strong>Position Applied:</strong> ${application.roleApplied}</p>
                    <p><strong>Experience:</strong> ${application.experienceYears || 'Not specified'}</p>
                    
                    ${application.portfolioUrl ? `<p><strong>Portfolio / Website:</strong> <a href="${application.portfolioUrl}" target="_blank">${application.portfolioUrl}</a></p>` : ''}
                    ${application.githubUrl ? `<p><strong>GitHub Profile:</strong> <a href="${application.githubUrl}" target="_blank">${application.githubUrl}</a></p>` : ''}
                    ${application.linkedinUrl ? `<p><strong>LinkedIn Profile:</strong> <a href="${application.linkedinUrl}" target="_blank">${application.linkedinUrl}</a></p>` : ''}
                    ${application.resumeUrl ? `<p><strong>Resume Link / File:</strong> <a href="${application.resumeUrl}" target="_blank">${application.resumeUrl}</a></p>` : ''}
                    
                    <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;" />
                    <p><strong>Cover Letter / Note:</strong></p>
                    <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #059669;">
                        ${(application.coverLetter || 'No cover note provided.').replace(/\n/g, '<br/>')}
                    </div>
                    <p style="font-size: 11px; color: #64748b; margin-top: 20px;">
                        Submitted on ${new Date().toLocaleString()} via Programming Bridge Careers Portal.
                    </p>
                </div>
            `,
            attachments: [],
        };

        if (fileAttachment && fileAttachment.path) {
            mailOptions.attachments.push({
                filename: fileAttachment.originalname || 'Candidate_Resume.pdf',
                path: fileAttachment.path,
            });
        }

        await transporter.sendMail(mailOptions);
        console.log(`Job application email sent successfully to ${recipient}`);
    } catch (err) {
        console.error('Job application email sending failed (non-critical):', err.message);
    }
};

// 1. Submit a new job application
exports.submitApplication = async (req, res) => {
    try {
        const {
            fullName,
            name,
            email,
            phone,
            roleApplied,
            position,
            experienceYears,
            experience,
            portfolioUrl,
            githubUrl,
            linkedinUrl,
            resumeUrl,
            coverLetter,
            message,
        } = req.body;

        const uploadedFile = req.file || (Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : null);

        const candidateName = (fullName || name || '').trim();
        const candidateEmail = (email || '').trim();
        const candidateRole = (roleApplied || position || 'General Engineering Application').trim();

        if (!candidateName) {
            return res.status(400).json({
                success: false,
                message: 'Full name is required',
            });
        }

        if (!candidateEmail) {
            return res.status(400).json({
                success: false,
                message: 'Valid email address is required',
            });
        }

        let resolvedResumeUrl = (resumeUrl || '').trim();
        if (uploadedFile?.path) {
            resolvedResumeUrl = uploadedFile.path;
        } else if (uploadedFile?.filename) {
            resolvedResumeUrl = `/uploads/resumes/${uploadedFile.filename}`;
        }


        const newApplication = new Application({
            fullName: candidateName,
            email: candidateEmail,
            phone: (phone || '').trim(),
            roleApplied: candidateRole,
            experienceYears: experienceYears || experience || '3+ Years',
            portfolioUrl: (portfolioUrl || '').trim(),
            githubUrl: (githubUrl || '').trim(),
            linkedinUrl: (linkedinUrl || '').trim(),
            resumeUrl: resolvedResumeUrl,
            coverLetter: (coverLetter || message || '').trim(),
        });

        const savedApplication = await newApplication.save();

        // Trigger email asynchronously to official mail with attachment
        sendJobApplicationEmail(savedApplication, uploadedFile).catch((err) => {
            console.error('Email error:', err);
        });

        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully! Our talent team will review your profile and reach out.',
            data: savedApplication,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit job application',
        });
    }
};

// 2. GET all applications
exports.getAllApplications = async (req, res) => {
    try {
        const { role, status, search } = req.query;
        let query = {};

        if (role && role !== 'All') {
            query.roleApplied = new RegExp(role.trim(), 'i');
        }

        if (status && status !== 'All') {
            query.status = status.trim();
        }

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { roleApplied: { $regex: search, $options: 'i' } },
            ];
        }

        const applications = await Application.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch applications',
        });
    }
};

// 3. GET application by ID
exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }
        return res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch application',
        });
    }
};

// 4. Update application status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update application status',
        });
    }
};

// 5. Delete application
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Application deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete application',
        });
    }
};
