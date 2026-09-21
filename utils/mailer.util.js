const nodemailer = require('nodemailer');

const getZohoTransporter = (isHR = false) => {
    const user = (isHR && process.env.HR_ZOHO_MAIL_USER)
        ? process.env.HR_ZOHO_MAIL_USER
        : (process.env.ZOHO_MAIL_USER || 'official@programmingbridge.org');
    const pass = (isHR && process.env.HR_ZOHO_MAIL_PASS)
        ? process.env.HR_ZOHO_MAIL_PASS
        : process.env.ZOHO_MAIL_PASS;
    const host = process.env.SMTP_HOST || 'smtp.zoho.com';
    const port = Number(process.env.SMTP_PORT) || 465;

    if (!pass) {
        throw new Error(`${isHR ? 'HR_ZOHO_MAIL_PASS or ' : ''}ZOHO_MAIL_PASS is not configured in .env`);
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
};

/**
 * Parses plain text / proposal markdown into polished responsive HTML blocks with tight icon spacing
 */
const formatBodyContent = (text) => {
    if (!text) return '';
    
    // Normalize newlines
    const normalized = text.replace(/\r\n/g, '\n').trim();
    const paragraphs = normalized.split(/\n\n+/);

    return paragraphs.map(para => {
        const lines = para.split('\n');
        
        const hasCustomElements = lines.some(l => 
            /^[\s]*([•\-\*]|\d+\.)\s+/.test(l.trim()) || 
            /^[📌🎯🚀💡⚡✨🛠️📋🔹📌]\s*/.test(l.trim())
        );

        if (hasCustomElements) {
            const formattedLines = lines.map(line => {
                const trimmed = line.trim();
                
                // Bullet point items
                if (/^[\s]*([•\-\*]|\d+\.)\s+/.test(trimmed)) {
                    const clean = trimmed.replace(/^[\s]*([•\-\*]|\d+\.)\s+/, '');
                    return `
                        <div style="margin: 5px 0; font-size: 14px; line-height: 1.6; word-break: break-word; overflow-wrap: break-word;" class="text-body">
                            <span style="color: #00E599; font-weight: 800; font-size: 13px; margin-right: 7px; display: inline-block;">✦</span><span style="display: inline;">${clean}</span>
                        </div>
                    `;
                }
                
                // Subsection Headers with Emoji
                if (/^[📌🎯🚀💡⚡✨🛠️📋🔹]\s*/.test(trimmed)) {
                    return `
                        <div style="margin-top: 14px; margin-bottom: 6px; font-size: 14px; font-weight: 800; word-break: break-word;" class="text-title">
                            ${trimmed}
                        </div>
                    `;
                }

                if (!trimmed) return '';

                return `<div style="margin: 4px 0 8px 0; font-size: 14px; line-height: 1.6; word-break: break-word;" class="text-body">${trimmed}</div>`;
            }).join('');

            return `<div style="margin: 0 0 16px 0;">${formattedLines}</div>`;
        }

        // Regular paragraph with line break support
        const formattedPara = lines.join('<br/>');
        return `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.75; word-break: break-word; overflow-wrap: break-word;" class="text-body">${formattedPara}</p>`;
    }).join('');
};

/**
 * Generates an ultra-premium, 100% Mobile Responsive, Dark & Light mode adaptive HTML email template
 */
const generateEmailTemplate = ({ subject, message, clientName = 'Valued Client' }) => {
    const formattedContent = formatBodyContent(message);
    const safeSubject = subject || 'Project Proposal & Technical Consultation';
    const currentYear = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${safeSubject}</title>

    <style>
        /* Base Reset */
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            box-sizing: border-box;
        }
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
            border-collapse: collapse !important;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        a {
            text-decoration: none;
            color: #00E599;
            word-break: break-word;
        }

        /* LIGHT MODE (Default Fallback) */
        .email-bg {
            background-color: #f1f5f9;
        }
        .email-container {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
        }
        .header-bg {
            background: linear-gradient(135deg, #090e17 0%, #111a2e 100%);
        }
        .badge-bg {
            background-color: rgba(0, 229, 153, 0.12);
            border: 1px solid rgba(0, 229, 153, 0.3);
            color: #00b377;
        }
        .text-title {
            color: #0f172a;
        }
        .text-body {
            color: #334155;
        }
        .text-muted {
            color: #64748b;
        }
        .info-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
        }
        .highlight-border {
            border-left: 4px solid #00E599;
        }
        .footer-bg {
            background-color: #0b0f19;
            border-top: 1px solid #1e293b;
        }
        .footer-text {
            color: #94a3b8;
        }

        /* DARK MODE OVERRIDES */
        @media (prefers-color-scheme: dark) {
            .email-bg {
                background-color: #07090e !important;
            }
            .email-container {
                background-color: #0f172a !important;
                border-color: #1e293b !important;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6) !important;
            }
            .header-bg {
                background: linear-gradient(135deg, #070a10 0%, #0d1527 100%) !important;
            }
            .badge-bg {
                background-color: rgba(0, 229, 153, 0.15) !important;
                border-color: rgba(0, 229, 153, 0.35) !important;
                color: #00E599 !important;
            }
            .text-title {
                color: #ffffff !important;
            }
            .text-body {
                color: #cbd5e1 !important;
            }
            .text-muted {
                color: #94a3b8 !important;
            }
            .info-card {
                background-color: #141e33 !important;
                border-color: #1e293b !important;
            }
            .highlight-border {
                border-left: 4px solid #00E599 !important;
            }
            .footer-bg {
                background-color: #07090e !important;
                border-top: 1px solid #1e293b !important;
            }
            .footer-text {
                color: #64748b !important;
            }
        }

        /* MOBILE RESPONSIVE STYLES (< 600px) */
        @media only screen and (max-width: 600px) {
            .wrapper-table {
                padding: 10px 4px !important;
            }
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
                border-radius: 14px !important;
            }
            .header-pad {
                padding: 20px 16px !important;
            }
            .header-stack-cell {
                display: block !important;
                width: 100% !important;
                text-align: left !important;
            }
            .header-badge-wrap {
                margin-top: 10px !important;
                text-align: left !important;
            }
            .content-pad {
                padding: 22px 16px 20px 16px !important;
            }
            .brand-heading {
                font-size: 20px !important;
            }
            .title-heading {
                font-size: 16px !important;
            }
            .pillar-stack-col {
                display: block !important;
                width: 100% !important;
                padding: 10px 0 !important;
                border-bottom: 1px solid rgba(148, 163, 184, 0.15) !important;
            }
            .pillar-stack-col-last {
                border-bottom: none !important;
            }
            .cta-btn-wrap {
                width: 100% !important;
                display: block !important;
            }
            .cta-btn {
                display: block !important;
                width: 100% !important;
                padding: 14px 16px !important;
                text-align: center !important;
            }
            .footer-pad {
                padding: 20px 16px !important;
            }
        }
    </style>
</head>
<body class="email-bg" style="margin: 0; padding: 0; background-color: #f1f5f9; min-width: 100%;">
    <!-- Main Email Wrapper Table -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-bg wrapper-table" style="background-color: #f1f5f9; padding: 24px 10px; width: 100%;">
        <tr>
            <td align="center" style="padding: 0;">
                
                <!-- Center Container (Max 600px Fluid) -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; max-width: 600px; border-radius: 18px; overflow: hidden; table-layout: fixed;" class="email-container">
                    
                    <!-- TOP GLOW ACCENT BAR -->
                    <tr>
                        <td height="4" style="background: linear-gradient(90deg, #00E599 0%, #38bdf8 50%, #00E599 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
                    </tr>

                    <!-- HEADER SECTION (Dark Luxury Gradient, Mobile Stacking) -->
                    <tr>
                        <td class="header-bg header-pad" style="background: linear-gradient(135deg, #090e17 0%, #111a2e 100%); padding: 28px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%;">
                                <tr>
                                    <td class="header-stack-cell" style="vertical-align: middle;">
                                        <!-- Logo & Brand Name -->
                                        <div class="brand-heading" style="font-size: 22px; font-weight: 900; letter-spacing: -0.6px; color: #ffffff; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                            Programming <span style="color: #00E599;">Bridge</span>
                                        </div>
                                        <div style="font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.4px; margin-top: 3px;">
                                            Engineering Digital Excellence
                                        </div>
                                    </td>
                                    <td class="header-stack-cell header-badge-wrap" align="right" style="vertical-align: middle;">
                                        <!-- Verified Agency Badge -->
                                        <span class="badge-bg" style="display: inline-block; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;">
                                            🛡️ Verified Proposal
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- MAIN BODY SECTION -->
                    <tr>
                        <td class="content-pad" style="padding: 32px 32px 24px 32px;">
                            
                            <!-- Subject Reference Tag -->
                            <div style="margin-bottom: 22px; padding-bottom: 14px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #00E599;">
                                    Official Communication
                                </span>
                                <h2 class="text-title title-heading" style="margin: 4px 0 0 0; font-size: 17px; font-weight: 800; line-height: 1.4; word-break: break-word;">
                                    ${safeSubject}
                                </h2>
                            </div>

                            <!-- Dynamic Proposal / Message Content -->
                            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; word-break: break-word; overflow-wrap: break-word;">
                                ${formattedContent}
                            </div>

                            <!-- VALUE PILLARS (Mobile Fluid Stacking Column) -->
                            <div style="margin-top: 26px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="info-card highlight-border" style="border-radius: 12px; width: 100%; table-layout: fixed;">
                                    <tr>
                                        <td style="padding: 14px 16px;">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%;">
                                                <tr>
                                                    <td class="pillar-stack-col" width="33%" style="padding: 4px 8px 4px 0; vertical-align: top;">
                                                        <div style="font-size: 12px; font-weight: 800; color: #00E599; margin-bottom: 2px;">⚡ Agile Execution</div>
                                                        <div class="text-muted" style="font-size: 11px; line-height: 1.4;">Rapid milestone sprints & transparent delivery</div>
                                                    </td>
                                                    <td class="pillar-stack-col" width="33%" style="padding: 4px 8px; vertical-align: top;">
                                                        <div style="font-size: 12px; font-weight: 800; color: #38bdf8; margin-bottom: 2px;">🔒 Enterprise Code</div>
                                                        <div class="text-muted" style="font-size: 11px; line-height: 1.4;">Clean, scalable & tested architecture</div>
                                                    </td>
                                                    <td class="pillar-stack-col pillar-stack-col-last" width="33%" style="padding: 4px 0 4px 8px; vertical-align: top;">
                                                        <div style="font-size: 12px; font-weight: 800; color: #00E599; margin-bottom: 2px;">🤝 Dedicated Lead</div>
                                                        <div class="text-muted" style="font-size: 11px; line-height: 1.4;">Direct communication with tech architects</div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- CALL TO ACTION BUTTON (Mobile Full Width) -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 26px; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="cta-btn-wrap">
                                            <tr>
                                                <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #00E599 0%, #00B377 100%); box-shadow: 0 4px 14px rgba(0, 229, 153, 0.35);">
                                                    <a href="mailto:official@programmingbridge.org?subject=${encodeURIComponent(`Re: ${safeSubject}`)}" target="_blank" class="cta-btn" style="display: inline-block; padding: 13px 26px; font-size: 13px; font-weight: 800; color: #090e17; text-decoration: none; letter-spacing: 0.3px; text-transform: uppercase;">
                                                        ✉️ Reply Directly to This Email
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <div class="text-muted" style="font-size: 11px; margin-top: 8px;">
                                            Or reply straight from your email app to continue the conversation.
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- EXECUTIVE SIGNATURE -->
                            <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(148, 163, 184, 0.2);">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%;">
                                    <tr>
                                        <td style="vertical-align: top;">
                                            <div class="text-muted" style="font-size: 12px; font-weight: 600;">Best regards,</div>
                                            <div class="text-title" style="font-size: 15px; font-weight: 900; margin-top: 2px;">
                                                Programming Bridge <span style="color: #00E599;">Team</span>
                                            </div>
                                            <div class="text-muted" style="font-size: 12px; font-weight: 600; margin-top: 1px;">
                                                Engineering & Client Advisory Department
                                            </div>
                                            <div style="margin-top: 6px; font-size: 12px;">
                                                <a href="mailto:official@programmingbridge.org" style="color: #00E599; font-weight: 700;">official@programmingbridge.org</a>
                                                <span class="text-muted" style="margin: 0 6px;">•</span>
                                                <a href="https://programmingbridge.org" target="_blank" style="color: #38bdf8; font-weight: 700;">programmingbridge.org</a>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                        </td>
                    </tr>

                    <!-- FOOTER SECTION (Responsive Padding & Center Align) -->
                    <tr>
                        <td class="footer-bg footer-pad" style="background-color: #0b0f19; padding: 22px 28px; text-align: center; border-top: 1px solid #1e293b;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%;">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600;">
                                            &copy; ${currentYear} <strong style="color: #f8fafc;">Programming Bridge</strong>. All rights reserved.
                                        </p>
                                        <p style="margin: 5px 0 0 0; font-size: 10px; color: #64748b; line-height: 1.5; max-width: 480px; word-break: break-word;">
                                            This email was sent from our official verified domain <strong>programmingbridge.org</strong>. If you received this in error, please disregard this transmission.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Generates an ultra-premium, dark/light adaptive HTML email template for candidate interview invitations
 */
const generateInterviewInvitationEmail = ({
    candidateName,
    roleApplied,
    interviewDate,
    interviewTime,
    interviewType = 'Google Meet',
    interviewLink,
    notes,
    interviewerName = 'Talent Acquisition & Technical Panel',
}) => {
    const currentYear = new Date().getFullYear();
    const cleanName = candidateName || 'Candidate';
    const cleanRole = roleApplied || 'Open Position';
    const safeSubject = `Interview Invitation: ${cleanRole} at Programming Bridge`;

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeSubject}</title>
    <style>
        html, body { margin: 0 !important; padding: 0 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        * { box-sizing: border-box; }
        .email-bg { background-color: #f1f5f9; }
        .email-container { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; max-width: 600px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .header-bg { background: linear-gradient(135deg, #090e17 0%, #111a2e 100%); padding: 28px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
        .info-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; }
        .highlight-border { border-left: 4px solid #00E599; }
        .footer-bg { background-color: #0b0f19; padding: 22px 28px; text-align: center; border-top: 1px solid #1e293b; }
        @media (prefers-color-scheme: dark) {
            .email-bg { background-color: #07090e !important; }
            .email-container { background-color: #0f172a !important; border-color: #1e293b !important; }
            .info-card { background-color: #141e33 !important; border-color: #1e293b !important; color: #cbd5e1 !important; }
            .text-main { color: #f8fafc !important; }
            .text-muted { color: #94a3b8 !important; }
        }
    </style>
</head>
<body class="email-bg" style="margin: 0; padding: 24px 10px; background-color: #f1f5f9;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 600px; width: 100%; border-radius: 18px; overflow: hidden; background-color: #ffffff;">
                    <!-- TOP GLOW ACCENT BAR -->
                    <tr>
                        <td height="4" style="background: linear-gradient(90deg, #00E599 0%, #38bdf8 50%, #00E599 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
                    </tr>
                    <!-- HEADER -->
                    <tr>
                        <td class="header-bg" style="background: linear-gradient(135deg, #090e17 0%, #111a2e 100%); padding: 28px 32px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <div style="font-size: 22px; font-weight: 900; color: #ffffff;">Programming <span style="color: #00E599;">Bridge</span></div>
                                        <div style="font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.4px; margin-top: 3px;">Talent Acquisition & Careers</div>
                                    </td>
                                    <td align="right">
                                        <span style="display: inline-block; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; background-color: rgba(0, 229, 153, 0.15); border: 1px solid rgba(0, 229, 153, 0.35); color: #00E599;">
                                            🎯 Interview Invitation
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- BODY -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px;">
                            <div style="margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #00E599;">Application Status Update</span>
                                <h2 style="margin: 4px 0 0 0; font-size: 18px; font-weight: 800; color: #0f172a;" class="text-main">
                                    Invitation for Interview: ${cleanRole}
                                </h2>
                            </div>

                            <p style="font-size: 15px; line-height: 1.7; color: #334155;" class="text-main">
                                Dear <strong>${cleanName}</strong>,
                            </p>
                            <p style="font-size: 14px; line-height: 1.7; color: #334155;" class="text-main">
                                Thank you for applying for the <strong>${cleanRole}</strong> position at <strong>Programming Bridge</strong>. Following a thorough review of your resume and background, we were impressed by your profile and would love to invite you for an official video interview session.
                            </p>

                            <!-- INTERVIEW DETAILS CARD -->
                            <div style="margin: 24px 0;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="info-card highlight-border" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
                                    <tr>
                                        <td>
                                            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #00E599; margin-bottom: 12px;">
                                                📅 Scheduled Interview Details
                                            </div>
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; line-height: 1.8;">
                                                <tr>
                                                    <td width="35%" style="color: #64748b; font-weight: 600;">🗓️ Date:</td>
                                                    <td style="color: #0f172a; font-weight: 800;" class="text-main">${interviewDate || 'To be mutually confirmed'}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #64748b; font-weight: 600;">⏰ Time:</td>
                                                    <td style="color: #0f172a; font-weight: 800;" class="text-main">${interviewTime || 'As per calendar invitation'}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #64748b; font-weight: 600;">📹 Platform / Mode:</td>
                                                    <td style="color: #0f172a; font-weight: 800;" class="text-main">${interviewType}</td>
                                                </tr>
                                                ${interviewerName ? `
                                                <tr>
                                                    <td style="color: #64748b; font-weight: 600;">👥 Interviewer:</td>
                                                    <td style="color: #0f172a; font-weight: 700;" class="text-main">${interviewerName}</td>
                                                </tr>` : ''}
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            ${interviewLink ? `
                            <!-- JOIN BUTTON -->
                            <div style="text-align: center; margin: 26px 0;">
                                <a href="${interviewLink}" target="_blank" style="display: inline-block; padding: 13px 30px; font-size: 13px; font-weight: 800; color: #090e17; text-decoration: none; letter-spacing: 0.4px; text-transform: uppercase; border-radius: 12px; background: linear-gradient(135deg, #00E599 0%, #00B377 100%); box-shadow: 0 4px 14px rgba(0, 229, 153, 0.35);">
                                    🚀 Join Video Interview
                                </a>
                                <div style="font-size: 11px; color: #64748b; margin-top: 8px;">Meeting Link: <a href="${interviewLink}" style="color: #00E599;">${interviewLink}</a></div>
                            </div>
                            ` : ''}

                            ${notes ? `
                            <div style="margin: 20px 0; padding: 14px; background-color: #f1f5f9; border-radius: 10px; font-size: 13px; line-height: 1.6; color: #334155; border-left: 3px solid #38bdf8;" class="info-card">
                                <strong>💡 Preparation & Instructions:</strong><br/>
                                ${notes.replace(/\n/g, '<br/>')}
                            </div>
                            ` : ''}

                            <div style="font-size: 13px; line-height: 1.6; color: #475569; margin-top: 20px;" class="text-muted">
                                📌 <strong>Interview Checklist:</strong>
                                <ul style="margin: 6px 0 0 0; padding-left: 20px;">
                                    <li>Please join from a quiet environment with a stable internet connection.</li>
                                    <li>Have your webcam and microphone ready and tested.</li>
                                    <li>If this is a technical round, please have your preferred IDE/code editor ready.</li>
                                </ul>
                            </div>

                            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-top: 22px;" class="text-main">
                                If you need to reschedule or have any prior questions, please reply directly to this email at least 24 hours in advance.
                            </p>

                            <!-- SIGNATURE -->
                            <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid rgba(148, 163, 184, 0.2); font-size: 13px;">
                                <div style="color: #64748b; font-weight: 600;">Warm regards,</div>
                                <div style="font-size: 15px; font-weight: 900; color: #0f172a; margin-top: 2px;" class="text-main">
                                    Talent Acquisition & HR Team
                                </div>
                                <div style="color: #64748b; font-size: 12px; margin-top: 1px;">Programming Bridge</div>
                                <div style="margin-top: 5px; font-size: 12px;">
                                    <a href="mailto:hr@programmingbridge.org" style="color: #00E599; font-weight: 700;">hr@programmingbridge.org</a>
                                    <span style="color: #94a3b8; margin: 0 6px;">•</span>
                                    <a href="https://programmingbridge.org" target="_blank" style="color: #38bdf8; font-weight: 700;">programmingbridge.org</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <!-- FOOTER -->
                    <tr>
                        <td class="footer-bg" style="background-color: #0b0f19; padding: 20px 24px; text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600;">
                                &copy; ${currentYear} <strong style="color: #f8fafc;">Programming Bridge</strong>. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Generates an ultra-polite, professional, encouraging candidate rejection email
 */
const generateRejectionEmail = ({ candidateName, roleApplied }) => {
    const currentYear = new Date().getFullYear();
    const cleanName = candidateName || 'Candidate';
    const cleanRole = roleApplied || 'Position';
    const safeSubject = `Update regarding your application for ${cleanRole} - Programming Bridge`;

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeSubject}</title>
    <style>
        html, body { margin: 0 !important; padding: 0 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        * { box-sizing: border-box; }
        .email-bg { background-color: #f1f5f9; }
        .email-container { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; max-width: 600px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .header-bg { background: linear-gradient(135deg, #090e17 0%, #111a2e 100%); padding: 28px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
        .info-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; }
        .footer-bg { background-color: #0b0f19; padding: 22px 28px; text-align: center; border-top: 1px solid #1e293b; }
        @media (prefers-color-scheme: dark) {
            .email-bg { background-color: #07090e !important; }
            .email-container { background-color: #0f172a !important; border-color: #1e293b !important; }
            .info-card { background-color: #141e33 !important; border-color: #1e293b !important; color: #cbd5e1 !important; }
            .text-main { color: #f8fafc !important; }
            .text-muted { color: #94a3b8 !important; }
        }
    </style>
</head>
<body class="email-bg" style="margin: 0; padding: 24px 10px; background-color: #f1f5f9;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 600px; width: 100%; border-radius: 18px; overflow: hidden; background-color: #ffffff;">
                    <!-- TOP ACCENT BAR -->
                    <tr>
                        <td height="4" style="background: linear-gradient(90deg, #64748b 0%, #00E599 50%, #64748b 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
                    </tr>
                    <!-- HEADER -->
                    <tr>
                        <td class="header-bg" style="background: linear-gradient(135deg, #090e17 0%, #111a2e 100%); padding: 28px 32px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <div style="font-size: 22px; font-weight: 900; color: #ffffff;">Programming <span style="color: #00E599;">Bridge</span></div>
                                        <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.4px; margin-top: 3px;">Talent Acquisition & Careers</div>
                                    </td>
                                    <td align="right">
                                        <span style="display: inline-block; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; background-color: rgba(148, 163, 184, 0.15); border: 1px solid rgba(148, 163, 184, 0.3); color: #94a3b8;">
                                            Application Update
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- BODY -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px;">
                            <div style="margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
                                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Recruitment Decision</span>
                                <h2 style="margin: 4px 0 0 0; font-size: 17px; font-weight: 800; color: #0f172a;" class="text-main">
                                    Application for ${cleanRole}
                                </h2>
                            </div>

                            <p style="font-size: 15px; line-height: 1.7; color: #334155;" class="text-main">
                                Dear <strong>${cleanName}</strong>,
                            </p>
                            <p style="font-size: 14px; line-height: 1.7; color: #334155;" class="text-main">
                                Thank you for taking the time to apply for the <strong>${cleanRole}</strong> position at Programming Bridge. We sincerely appreciate your interest in joining our engineering team and the effort you invested in sharing your profile with us.
                            </p>
                            <p style="font-size: 14px; line-height: 1.7; color: #334155;" class="text-main">
                                We received a substantial number of outstanding applications for this opening. After careful consideration and review against our current project specifications, we have decided to move forward with other candidates whose skill sets more closely align with the immediate requirements of this specific role.
                            </p>

                            <!-- ENCOURAGING NOTE CARD -->
                            <div style="margin: 22px 0;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="info-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                                    <tr>
                                        <td>
                                            <div style="font-size: 12px; font-weight: 800; color: #00E599; margin-bottom: 4px;">🤝 Retained in Active Talent Pool</div>
                                            <div style="font-size: 13px; line-height: 1.6; color: #64748b;" class="text-muted">
                                                We were very impressed by your qualifications and have retained your resume in our talent network. Should a future opening matching your expertise become available, our recruitment team will reach out directly.
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <p style="font-size: 14px; line-height: 1.7; color: #334155;" class="text-main">
                                We wish you every success in your ongoing career endeavors and future professional pursuits.
                            </p>

                            <!-- SIGNATURE -->
                            <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid rgba(148, 163, 184, 0.2); font-size: 13px;">
                                <div style="color: #64748b; font-weight: 600;">Sincerely,</div>
                                <div style="font-size: 15px; font-weight: 900; color: #0f172a; margin-top: 2px;" class="text-main">
                                    Talent Acquisition & HR Team
                                </div>
                                <div style="color: #64748b; font-size: 12px; margin-top: 1px;">Programming Bridge</div>
                                <div style="margin-top: 5px; font-size: 12px;">
                                    <a href="mailto:hr@programmingbridge.org" style="color: #00E599; font-weight: 700;">hr@programmingbridge.org</a>
                                    <span style="color: #94a3b8; margin: 0 6px;">•</span>
                                    <a href="https://programmingbridge.org" target="_blank" style="color: #38bdf8; font-weight: 700;">programmingbridge.org</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <!-- FOOTER -->
                    <tr>
                        <td class="footer-bg" style="background-color: #0b0f19; padding: 20px 24px; text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600;">
                                &copy; ${currentYear} <strong style="color: #f8fafc;">Programming Bridge</strong>. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Send an email via Zoho Mail SMTP (Supports Official & HR accounts)
 */
const sendMailFromZoho = async ({
    to,
    subject,
    message,
    html,
    replyTo,
    clientName,
    fromName = 'Programming Bridge',
    isHR = false,
}) => {
    const transporter = getZohoTransporter(isHR);
    const hrAddress = process.env.HR_ZOHO_MAIL_USER || 'hr@programmingbridge.org';
    const officialAddress = process.env.ZOHO_MAIL_USER || 'official@programmingbridge.org';
    const fromAddress = isHR ? hrAddress : officialAddress;

    const senderDisplayName = isHR 
        ? (fromName && fromName !== 'Programming Bridge' ? fromName : 'Programming Bridge HR & Talent Team') 
        : fromName;
    const defaultReplyTo = isHR ? hrAddress : officialAddress;

    const htmlContent = html || generateEmailTemplate({ subject, message, clientName });

    const mailOptions = {
        from: `"${senderDisplayName}" <${fromAddress}>`,
        to,
        replyTo: replyTo || defaultReplyTo,
        subject,
        text: message || subject,
        html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
};

module.exports = {
    getZohoTransporter,
    sendMailFromZoho,
    generateEmailTemplate,
    generateInterviewInvitationEmail,
    generateRejectionEmail,
    formatBodyContent,
};
