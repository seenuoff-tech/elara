const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// ROUTE: RAZORPAY
// ---------------------------------------------------------
app.post('/api/razorpay', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt#1' } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, error: 'Amount is required' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Keys are missing');
      return res.status(500).json({ success: false, error: 'Razorpay keys are missing' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency,
      receipt,
    };

    const order = await instance.orders.create(options);
    return res.json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp to avoid overwrites
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  },
});
const upload = multer({ storage });

// Serve static files from 'uploads' directory
app.use('/images', express.static(uploadDir));

// ---------------------------------------------------------
// ROUTE: UPLOAD IMAGES
// ---------------------------------------------------------
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  // The frontend needs the URL relative to the images directory
  // or absolute URL. We return the filename so it can be appended to backend URL.
  const fileUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename
  });
});

// ---------------------------------------------------------
// ROUTE: MANAGE IMAGES (LIST & DELETE)
// ---------------------------------------------------------
app.get('/api/images', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Unable to read directory' });
    }
    
    const images = files.map(file => {
      const stats = fs.statSync(path.join(uploadDir, file));
      return {
        name: file,
        url: `${req.protocol}://${req.get('host')}/images/${file}`,
        size: stats.size,
        createdAt: stats.birthtime
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

    res.json({ success: true, images });
  });
});

app.delete('/api/images', (req, res) => {
  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).json({ success: false, error: 'Filename is required' });
  }

  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted' });
  } else {
    res.status(404).json({ success: false, error: 'File not found' });
  }
});

// Basic root route
app.get('/', (req, res) => {
  res.send('Elara Silver Backend API is running!');
});

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
