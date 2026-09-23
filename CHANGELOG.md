# Changelog - Programming Bridge Backend REST API

All notable changes to the **Programming Bridge Backend REST API** server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] — 2026-03-20

### Added
- **Zoho HR Transporter Authentication**: Updated `mailer.util.js` with dual SMTP transporters (`official@` and `hr@programmingbridge.org`) with automatic switching when `isHR: true`.
- **Candidate Email Signatures & Reply-To**: All recruitment dispatches (interview invites, application rejections) now originate from `hr@programmingbridge.org`.
- **Inbound Application Notifications**: New applicant submissions automatically trigger alert dispatches to the HR mailbox (`hr@programmingbridge.org`).

---

## [0.2.1] — 2026-02-25

### Added & Fixed
- **Phone Number Validation**: Enhanced `express-validator` rules for inquiry and job applications to support international phone characters (`+`, digits, hyphens, spaces, parens) with minimum character requirements.
- **Inquiry Payload Sanitization**: Added support for flexible budget ranges and project types.
