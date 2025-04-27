// server.js

require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// 1) Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));  // serves your CSS, JS, images, etc.

// 2) Email Transporter (Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // e.g. 'autoalchemy1@gmail.com'
    pass: process.env.EMAIL_PASS   // your 16-char App Password
  }
});

// 3) Your API Route: POST /send
app.post('/send', async (req, res) => {
  const {
    name, email, phone, makeModel, vehicleType,
    location, condition, mattePaint, petHair,
    service, preferredDate, appointmentTime, message
  } = req.body;

  try {
    await transporter.sendMail({
      from:    `"Auto Alchemy" <${process.env.EMAIL_USER}>`,
      to:      'autoalchemy1@gmail.com',    // keeps sending to your business inbox
      replyTo: email,                       // so “Reply” goes to the customer
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
      attachments: [{
        filename: 'logo.png',
        path:     path.join(__dirname, 'public/images/logo.png'),
        cid:      'logo'
      }]
    });

    return res.status(200).send('Email sent successfully!');
  } catch (err) {
    console.error('❌ EMAIL ERROR:', err);
    return res
      .status(500)
      .send(`Error sending email: ${err.message}`);
  }
});

// 4) Catch-all for client-side routing & static SPA
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5) Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
