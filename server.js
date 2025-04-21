require('dotenv').config(); // Load .env file variables into process.env if present&#8203;:contentReference[oaicite:7]{index=7}

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Use port from environment or default to 3000&#8203;:contentReference[oaicite:8]{index=8}

// Middleware configuration
app.use(cors()); // Enable CORS for all origins (consider restricting in production)&#8203;:contentReference[oaicite:9]{index=9}
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory&#8203;:contentReference[oaicite:10]{index=10}

// Email transporter (Nodemailer) setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});
// Note: Ensure GMAIL_USER and GMAIL_PASS are set in environment (use an app password if 2FA is enabled)&#8203;:contentReference[oaicite:11]{index=11}

// Routes
app.post('/send', async (req, res) => {
  // Destructure fields from request body (contact form data)
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
    // Compose the email details
    const mailOptions = {
      from: `"Auto Alchemy" <${process.env.GMAIL_USER}>`, // Sender address (from .env)
      to: process.env.GMAIL_USER, // Recipient address (your email to receive the form data)
      subject: '🚘 New Auto Alchemy Estimate Request', // Email subject line
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
          path: path.join(__dirname, 'public', 'images', 'logo.png'),
          cid: 'logo' // Content ID for inline image (must match "cid:logo" in HTML)&#8203;:contentReference[oaicite:12]{index=12}
        }
      ]
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Email error:', error); // Log the error for debugging
    res.status(500).send('Error sending email'); // Send a generic error response
  }
});

// Catch-all route (SPA support) - serve index.html for any unmatched route&#8203;:contentReference[oaicite:13]{index=13}
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
