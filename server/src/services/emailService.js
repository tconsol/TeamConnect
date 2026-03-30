const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../config/logger');

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
    logger.warn('Email not sent — transporter not configured');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"TCON Solutions" <${config.smtp.from}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error('Email send error:', error.message);
  }
};

const sendContactEmail = async (lead) => {
  await sendEmail({
    to: config.smtp.user,
    subject: `New Contact: ${lead.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone || 'N/A'}</p>
      <p><strong>Company:</strong> ${lead.company || 'N/A'}</p>
      <p><strong>Service:</strong> ${lead.service || 'N/A'}</p>
      <p><strong>Budget:</strong> ${lead.budget || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${lead.message}</p>
    `,
  });
};

const sendApplicationEmail = async (application, job) => {
  await sendEmail({
    to: config.smtp.user,
    subject: `New Application: ${job.title}`,
    html: `
      <h2>New Job Application</h2>
      <p><strong>Position:</strong> ${job.title}</p>
      <p><strong>Name:</strong> ${application.name}</p>
      <p><strong>Email:</strong> ${application.email}</p>
      <p><strong>Phone:</strong> ${application.phone || 'N/A'}</p>
      <p><strong>LinkedIn:</strong> ${application.linkedIn || 'N/A'}</p>
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
    subject: `Application Update: ${jobTitle}`,
    html: `
      <h2>Application Status Update</h2>
      <p>Dear ${name},</p>
      <p>${statusMessages[status] || `Your application status has been updated to: ${status}`}</p>
      <p>Position: ${jobTitle}</p>
      <br/>
      <p>Best regards,<br/>TCON Solutions Team</p>
    `,
  });
};

module.exports = { sendEmail, sendContactEmail, sendApplicationEmail, sendStatusUpdateEmail };
