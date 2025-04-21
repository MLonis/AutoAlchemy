require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Serve index.html for all unknown routes (for Render deployment)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Routes
app.post('/send', async (req, res) => {
  const {
    name,
    email,
    phone,
    makeModel,
    vehicleType,
    location,
    condition,
    mattePaint,
    petHair,
    service,
    preferredDate,
    appointmentTime,
    message
  } = req.body;

  try {
    await transporter.sendMail({
      from: `"Auto Alchemy" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: '🚘 New Auto Alchemy Estimate Request',
      html: `
      <div style="background: #0a0a0a; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; color: #FFFFFF;">
        <div style="text-align: center;">
          <img src="cid:logo" alt="Auto Alchemy Logo" style="width: 100px; margin-bottom: 15px;">
        </div>
        <h2 style="text-align: center; color: #3AB6FF;">Auto Alchemy</h2>
        <p style="text-align: center; color: #CCCCCC; margin-bottom: 20px;">Premium Mobile Detailing</p>
        <hr style="border: none; height: 2px; background: linear-gradient(to right, transparent, #3AB6FF, transparent); margin: 20px 0;">
        <h3 style="color: #5AD1FF;">Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #5AD1FF; text-decoration: none;">${email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${phone}" style="color: #5AD1FF; text-decoration: none;">${phone}</a></p>
        <p><strong>City:</strong> ${location}</p>
        <hr style="border: none; height: 1px; background: #333; margin: 20px 0;">
        <h3 style="color: #5AD1FF;">Vehicle & Service Details</h3>
        <p><strong>Make & Model:</strong> ${makeModel}</p>
        <p><strong>Vehicle Type:</strong> ${vehicleType}</p>
        <p><strong>Condition:</strong> ${condition}</p>
        <p><strong>Matte Paint:</strong> ${mattePaint}</p>
        <p><strong>Pet Hair:</strong> ${petHair}</p>
        <p><strong>Service Requested:</strong> ${service}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${appointmentTime}</p>
        <hr style="border: none; height: 1px; background: #333; margin: 20px 0;">
        <h3 style="color: #FF6B00;">Additional Notes</h3>
        <p>${message}</p>
        <hr style="border: none; height: 2px; background: linear-gradient(to right, transparent, #FF6B00, transparent); margin: 30px 0;">
        <p style="text-align: center; font-size: 0.95rem; color: #999; margin-top: 20px; text-shadow: 0 0 4px rgba(90,209,255,0.3);">
          <strong style="color: #3AB6FF;">Auto Alchemy</strong><br>
          Premium Mobile Detailing | Exceptional Care, Every Time.
        </p>
      </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, 'public/images/logo.png'),
          cid: 'logo' // match the img src cid:logo
        }
      ]
    });

    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).send('Error sending email');
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
