// server.js

require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const path       = require('path');
const fs         = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// 1) Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));  // serves your CSS, JS, images, etc.

// 2) Inline‐encode your logo (no attachments)
const logoPath = path.join(__dirname, 'public/images/logo.png');
const logoData = fs.readFileSync(logoPath).toString('base64');
const logoURI  = `data:image/png;base64,${logoData}`;

// 3) Email Transporter (Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // e.g. 'autoalchemy1@gmail.com'
    pass: process.env.EMAIL_PASS   // your 16-char App Password
  }
});

// 4) Your API Route: POST /send
app.post('/send', async (req, res) => {
  const {
    name, email, phone, makeModel, vehicleType,
    location, condition, mattePaint, petHair,
    service, preferredDate, appointmentTime, message
  } = req.body;

  try {
    await transporter.sendMail({
      from:    `"Auto Alchemy" <${process.env.EMAIL_USER}>`,
      to:      'autoalchemy1@gmail.com',
      replyTo: email,
      subject: '🚘 New Auto Alchemy Estimate Request',
      html: `
        <body style="margin:0;padding:0;">
          <!-- full‐width dark wrapper -->
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            bgcolor="#000000"
            style="background-color:#000000;"
          >
            <tr><td align="center">
              <!-- centered inner container -->
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                bgcolor="#000000"
                style="max-width:600px;margin:0 auto;background-color:#000000;"
              >
                <tr><td style="padding:30px;color:#FFFFFF;font-family:'Segoe UI',sans-serif;">

                  <!-- Inline Base64 logo: no download link -->
                  <div style="text-align:center;margin-bottom:15px;">
                    <img
                      src="${logoURI}"
                      alt="Auto Alchemy Logo"
                      style="width:100px;display:block;margin:0 auto;"
                    />
                  </div>

                  <h2 style="text-align:center;color:#3AB6FF;">Auto Alchemy</h2>
                  <p style="text-align:center;color:#CCCCCC;margin-bottom:20px;">
                    Premium Mobile Detailing
                  </p>
                  <hr style="border:none;height:2px;background:linear-gradient(to right,transparent,#3AB6FF,transparent);margin:20px 0;">

                  <h3 style="color:#5AD1FF;">Customer Information</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}" style="color:#5AD1FF;text-decoration:none;">${email}</a></p>
                  <p><strong>Phone:</strong> <a href="tel:${phone}" style="color:#5AD1FF;text-decoration:none;">${phone}</a></p>
                  <p><strong>City:</strong> ${location}</p>

                  <hr style="border:none;height:1px;background:#333;margin:20px 0;">
                  <h3 style="color:#5AD1FF;">Vehicle & Service Details</h3>
                  <p><strong>Make & Model:</strong> ${makeModel}</p>
                  <p><strong>Vehicle Type:</strong> ${vehicleType}</p>
                  <p><strong>Condition:</strong> ${condition}</p>
                  <p><strong>Matte Paint:</strong> ${mattePaint}</p>
                  <p><strong>Pet Hair:</strong> ${petHair}</p>
                  <p><strong>Service Requested:</strong> ${service}</p>
                  <p><strong>Preferred Date:</strong> ${preferredDate}</p>
                  <p><strong>Preferred Time:</strong> ${appointmentTime}</p>

                  <hr style="border:none;height:1px;background:#333;margin:20px 0;">
                  <h3 style="color:#FF6B00;">Additional Notes</h3>
                  <p>${message}</p>

                  <hr style="border:none;height:2px;background:linear-gradient(to right,transparent,#FF6B00,transparent);margin:30px 0;">
                  <p style="text-align:center;font-size:0.95rem;color:#999;margin-top:20px;text-shadow:0 0 4px rgba(90,209,255,0.3);">
                    <strong style="color:#3AB6FF;">Auto Alchemy</strong><br>
                    Premium Mobile Detailing | Exceptional Care, Every Time.
                  </p>

                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
      `
      // <<— notice: no `attachments` key at all
    });

    return res.status(200).send('Email sent successfully!');
  } catch (err) {
    console.error('❌ EMAIL ERROR:', err);
    return res
      .status(500)
      .send(`Error sending email: ${err.message}`);
  }
});

// 5) Catch-all for client-side routing & static SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6) Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
