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
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer config for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'elara_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4'],
  },
});
const upload = multer({ storage });


// ---------------------------------------------------------
// ROUTE: UPLOAD IMAGES
// ---------------------------------------------------------
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  // Return the Cloudinary URL
  res.json({
    success: true,
    url: req.file.path, // Cloudinary secure URL
    filename: req.file.filename // Cloudinary public_id
  });
});

// ---------------------------------------------------------
// ROUTE: MANAGE IMAGES (LIST & DELETE)
// ---------------------------------------------------------
app.get('/api/images', async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression('folder:elara_uploads')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();
      
    const images = result.resources.map(file => ({
      name: file.public_id,
      url: file.secure_url,
      size: file.bytes,
      createdAt: file.created_at
    }));

    res.json({ success: true, images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ success: false, error: 'Unable to fetch images from Cloudinary' });
  }
});

app.delete('/api/images', async (req, res) => {
  const filename = req.query.filename; // this is the public_id
  if (!filename) {
    return res.status(400).json({ success: false, error: 'Filename (public_id) is required' });
  }

  try {
    await cloudinary.uploader.destroy(filename);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, error: 'Failed to delete image' });
  }
});

// Basic root route
app.get('/', (req, res) => {
  res.send('Elara Silver Backend API is running!');
});

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
