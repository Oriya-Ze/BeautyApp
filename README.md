# BeautyApp - Personalized Beauty & Shopping Assistant

A mobile application that analyzes face photos to provide personalized recommendations for skincare, makeup, and outfits.

## 🎯 Features

- 📸 **Photo Upload**: Take a photo or upload from gallery
- 🤖 **AI Analysis**: Face analysis using third-party AI services
- 💄 **Personalized Recommendations**:
  - **Skincare**: Cleanser, Serum, Moisturizer, SPF
  - **Makeup**: Foundation, Blush, Lipstick, Eye Makeup
  - **Outfits**: Style recommendations based on skin tone and undertone
- 🌐 **Web Integration**: Recommendations include links that open in browser/webview

## 🏗️ Project Structure

```
BeautyApp/
├── backend/          # Node.js Express API
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic (AI, recommendations)
│   │   └── middleware/
│   ├── uploads/      # Temporary image storage
│   └── server.js
│
├── frontend/         # React (Vite) web app
│   ├── src/
│   │   ├── screens/  # App screens
│   │   ├── services/ # API client
│   │   └── App.jsx
│   └── Dockerfile
│
├── mobile/           # React Native (Expo) app
│   ├── src/
│   │   ├── screens/  # App screens
│   │   ├── components/
│   │   ├── services/ # API client
│   │   └── navigation/
│   └── App.js
│
└── docker-compose.yml
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for backend)
- Docker & Docker Compose (for backend)
- Expo CLI (for mobile app)
- AI Service API Key (Google Cloud Vision, AWS Rekognition, or Azure Face API)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your AI API keys
   ```

4. **Run with Docker (Recommended):**
   ```bash
   cd ..
   docker compose up --build
   ```

   Or run locally:
   ```bash
   npm run dev
   ```

5. **Backend will be available at:** `http://localhost:5000`

### Mobile App Setup

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API URL in `src/services/api.js`:**
   - For iOS Simulator: `http://localhost:5000`
   - For Android Emulator: `http://10.0.2.2:5000`
   - For physical device: `http://YOUR_COMPUTER_IP:5000`

4. **Start Expo:**
   ```bash
   npm start
   ```

5. **Run on device/simulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## 🔧 Configuration

### AI Service Integration

The backend includes a placeholder AI service. You need to integrate with one of:

1. **Google Cloud Vision API**
   ```bash
   npm install @google-cloud/vision
   ```
   Set `GOOGLE_CLOUD_API_KEY` in `.env`

2. **AWS Rekognition**
   ```bash
   npm install aws-sdk
   ```
   Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` in `.env`

3. **Azure Face API**
   ```bash
   npm install @azure/cognitiveservices-face
   ```
   Set `AZURE_FACE_API_KEY`, `AZURE_FACE_ENDPOINT` in `.env`

4. **Other Services**: Face++, Microsoft Face API, etc.

Edit `backend/src/services/aiService.js` to integrate your chosen service.

### API Endpoints

- `POST /api/analyze-face` - Analyze face image and get recommendations
  - Body: `multipart/form-data` with `image` file
  - Returns: Analysis results and recommendations

- `GET /api/recommendations/test` - Get sample recommendations (testing)

- `GET /health` - Health check endpoint

## 📱 App Flow

1. **Photo Upload Screen**: User uploads photo or takes a picture
2. **Analyzing Screen**: Shows loading animation while processing
3. **Results Screen**: Displays personalized recommendations in 3 tabs:
   - **Skincare**: Cleanser, Serum, Moisturizer, SPF
   - **Makeup**: Foundation, Blush, Lipstick, Eye Makeup
   - **Outfits**: Style recommendations with color suggestions

## 🧪 Testing

Test the API without mobile app:

```bash
# Using curl
curl -X POST http://localhost:5000/api/analyze-face \
  -F "image=@/path/to/your/image.jpg"

# Test endpoint
curl http://localhost:5000/api/recommendations/test
```

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Mobile Development

```bash
cd mobile
npm start    # Expo development server
```

## 📝 Notes

- Images are temporarily stored in `backend/uploads/`
- For production, consider using cloud storage (S3, Cloudinary)
- Update recommendation URLs in `recommendationEngine.js` to point to actual product pages
- The AI service currently returns mock data - implement actual integration for production

## 🚢 Production Deployment

1. Set environment variables in production
2. Use cloud storage for images (not local filesystem)
3. Configure CORS properly
4. Use environment-specific API URLs in mobile app
5. Consider adding authentication if needed
6. Set up proper logging and monitoring

## 📄 License

ISC

