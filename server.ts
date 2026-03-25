import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Configure your SMTP transporter here
      // For Gmail, use an App Password: https://myaccount.google.com/apppasswords
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER || 'soundwaversa@gmail.com',
          pass: process.env.SMTP_PASS, // This should be an App Password
        },
      });

      const mailOptions = {
        from: email,
        to: 'soundwaversa@gmail.com',
        subject: `New Contact Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email,
      };

      // If SMTP_PASS is not set, we'll just log it and return success for the demo
      if (!process.env.SMTP_PASS) {
        console.log('SMTP_PASS not set. Logging message instead:');
        console.log(mailOptions);
        return res.json({ 
          success: true, 
          message: 'Demo mode: Message logged to console. Set SMTP_PASS to send real emails.' 
        });
      }

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
