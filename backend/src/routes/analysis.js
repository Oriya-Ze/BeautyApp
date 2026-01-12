const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const aiService = require('../services/aiService');
const recommendationEngine = require('../services/recommendationEngine');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'face-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

/**
 * POST /api/analyze-face
 * Analyzes a face image and returns personalized recommendations
 */
router.post('/analyze-face', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);

    console.log(`Analyzing face image: ${req.file.filename}`);

    // Analyze face with AI service
    const analysis = await aiService.analyzeFace(imageBuffer);

    // Generate recommendations based on analysis
    const recommendations = recommendationEngine.generateRecommendations(analysis);

    // Clean up uploaded file (optional - you might want to keep it temporarily)
    // fs.unlinkSync(imagePath);

    res.json({
      success: true,
      analysis: {
        skinType: analysis.skinType,
        skinTone: analysis.skinTone,
        undertone: analysis.undertone,
        facialFeatures: analysis.facialFeatures
      },
      recommendations: recommendations
    });

  } catch (error) {
    console.error('Error analyzing face:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Failed to analyze image',
      message: error.message
    });
  }
});

/**
 * GET /api/recommendations/test
 * Test endpoint to get sample recommendations
 */
router.get('/recommendations/test', (req, res) => {
  const testAnalysis = {
    skinType: 'combination',
    skinTone: 'medium',
    undertone: 'warm',
    facialFeatures: {
      faceShape: 'oval',
      eyeColor: 'brown',
      hairColor: 'dark'
    }
  };

  const recommendations = recommendationEngine.generateRecommendations(testAnalysis);

  res.json({
    success: true,
    analysis: testAnalysis,
    recommendations: recommendations
  });
});

module.exports = router;


