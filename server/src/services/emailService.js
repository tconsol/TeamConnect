const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../config/logger');

const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const maskEmail = (email) => {
  if (!email) return '***';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return `${local[0]}***@${domain}`;
};

let transporter;
try {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
} catch {
  logger.warn('Email transporter not configured');
}

const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    logger.warn('Email not sent transporter not configured');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"TCON Solutions" <${config.smtp.from}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${maskEmail(to)}`);
  } catch (error) {
    logger.error('Email send error:', error.message);
  }
};

const sendContactEmail = async (lead) => {
  await sendEmail({
    to: config.smtp.user,
    subject: `New Contact: ${escapeHtml(lead.subject)}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(lead.phone) || 'N/A'}</p>
      <p><strong>Company:</strong> ${escapeHtml(lead.company) || 'N/A'}</p>
      <p><strong>Service:</strong> ${escapeHtml(lead.service) || 'N/A'}</p>
      <p><strong>Budget:</strong> ${escapeHtml(lead.budget) || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(lead.message)}</p>
    `,
  });
};

const sendApplicationEmail = async (application, job) => {
  await sendEmail({
    to: config.smtp.user,
    subject: `New Application: ${escapeHtml(job.title)}`,
    html: `
      <h2>New Job Application</h2>
      <p><strong>Position:</strong> ${escapeHtml(job.title)}</p>
      <p><strong>Name:</strong> ${escapeHtml(application.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(application.phone) || 'N/A'}</p>
      <p><strong>LinkedIn:</strong> ${escapeHtml(application.linkedIn) || 'N/A'}</p>
    `,
  });
};

const sendStatusUpdateEmail = async (email, name, jobTitle, status) => {
  const statusMessages = {
    reviewed: 'Your application has been reviewed by our team.',
    shortlisted: 'Congratulations! You have been shortlisted.',
    interviewed: 'Thank you for the interview. We will get back to you soon.',
    rejected: 'After careful consideration, we have decided to move forward with other candidates.',
    hired: 'Congratulations! We are delighted to offer you the position.',
  };

  await sendEmail({
    to: email,
    subject: `Application Update: ${escapeHtml(jobTitle)}`,
    html: `
      <h2>Application Status Update</h2>
      <p>Dear ${escapeHtml(name)},</p>
      <p>${statusMessages[status] || `Your application status has been updated to: ${escapeHtml(status)}`}</p>
      <p>Position: ${escapeHtml(jobTitle)}</p>
      <br/>
      <p>Best regards,<br/>TCON Solutions Team</p>
    `,
  });
};

module.exports = { sendEmail, sendContactEmail, sendApplicationEmail, sendStatusUpdateEmail };
